use sqlx::postgres::PgRow;
use sqlx::{Column, Row, TypeInfo};
use tauri::State;

use super::connection::AppState;

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct QueryResult {
    pub columns: Vec<String>,
    pub rows: Vec<Vec<serde_json::Value>>,
    pub execution_time_ms: u64,
    pub rows_affected: Option<u64>,
}

#[tauri::command]
pub async fn execute_query(
    query: String,
    state: State<'_, AppState>,
) -> Result<QueryResult, String> {
    let guard = state.pool.lock().await;
    let pool = guard.as_ref().ok_or("Not connected to a database")?;

    let start = std::time::Instant::now();
    let trimmed = query.trim().to_uppercase();

    if trimmed.starts_with("SELECT")
        || trimmed.starts_with("WITH")
        || trimmed.starts_with("SHOW")
        || trimmed.starts_with("EXPLAIN")
    {
        let rows: Vec<PgRow> = sqlx::query(&query)
            .fetch_all(pool)
            .await
            .map_err(|e| format!("Query error: {}", e))?;

        let execution_time_ms = start.elapsed().as_millis() as u64;

        if rows.is_empty() {
            return Ok(QueryResult {
                columns: vec![],
                rows: vec![],
                execution_time_ms,
                rows_affected: None,
            });
        }

        let columns: Vec<String> = rows[0]
            .columns()
            .iter()
            .map(|c| c.name().to_string())
            .collect();

        let result_rows: Vec<Vec<serde_json::Value>> = rows
            .iter()
            .map(|row| {
                (0..row.columns().len())
                    .map(|i| pg_value_to_json(row, i))
                    .collect()
            })
            .collect();

        Ok(QueryResult {
            columns,
            rows: result_rows,
            execution_time_ms,
            rows_affected: None,
        })
    } else {
        let result = sqlx::query(&query)
            .execute(pool)
            .await
            .map_err(|e| format!("Query error: {}", e))?;

        let execution_time_ms = start.elapsed().as_millis() as u64;

        Ok(QueryResult {
            columns: vec![],
            rows: vec![],
            execution_time_ms,
            rows_affected: Some(result.rows_affected()),
        })
    }
}

fn pg_value_to_json(row: &PgRow, index: usize) -> serde_json::Value {
    let column = &row.columns()[index];
    let type_info = column.type_info();
    let type_name = type_info.name();

    match type_name {
        "INT2" | "INT4" | "INT8" | "SERIAL" | "BIGSERIAL" => {
            if let Ok(v) = row.try_get::<i64, _>(index) {
                serde_json::Value::Number(v.into())
            } else if let Ok(v) = row.try_get::<i32, _>(index) {
                serde_json::Value::Number(v.into())
            } else if let Ok(v) = row.try_get::<i16, _>(index) {
                serde_json::Value::Number(v.into())
            } else {
                serde_json::Value::Null
            }
        }
        "FLOAT4" | "FLOAT8" | "NUMERIC" => {
            if let Ok(v) = row.try_get::<f64, _>(index) {
                serde_json::Number::from_f64(v)
                    .map(serde_json::Value::Number)
                    .unwrap_or(serde_json::Value::Null)
            } else if let Ok(v) = row.try_get::<f32, _>(index) {
                serde_json::Number::from_f64(v as f64)
                    .map(serde_json::Value::Number)
                    .unwrap_or(serde_json::Value::Null)
            } else {
                serde_json::Value::Null
            }
        }
        "BOOL" => {
            if let Ok(v) = row.try_get::<bool, _>(index) {
                serde_json::Value::Bool(v)
            } else {
                serde_json::Value::Null
            }
        }
        "TEXT" | "VARCHAR" | "CHAR" | "BPCHAR" | "NAME" => {
            if let Ok(v) = row.try_get::<String, _>(index) {
                serde_json::Value::String(v)
            } else {
                serde_json::Value::Null
            }
        }
        "BYTEA" => {
            if let Ok(v) = row.try_get::<Vec<u8>, _>(index) {
                serde_json::Value::String(format!("<BLOB {} bytes>", v.len()))
            } else {
                serde_json::Value::Null
            }
        }
        "JSON" | "JSONB" => {
            if let Ok(v) = row.try_get::<serde_json::Value, _>(index) {
                v
            } else {
                serde_json::Value::Null
            }
        }
        "UUID" => {
            if let Ok(v) = row.try_get::<uuid::Uuid, _>(index) {
                serde_json::Value::String(v.to_string())
            } else {
                serde_json::Value::Null
            }
        }
        "TIMESTAMP" | "TIMESTAMPTZ" => {
            if let Ok(v) = row.try_get::<chrono::NaiveDateTime, _>(index) {
                serde_json::Value::String(v.to_string())
            } else if let Ok(v) = row.try_get::<chrono::DateTime<chrono::Utc>, _>(index) {
                serde_json::Value::String(v.to_string())
            } else if let Ok(v) = row.try_get::<String, _>(index) {
                serde_json::Value::String(v)
            } else {
                serde_json::Value::Null
            }
        }
        "DATE" => {
            if let Ok(v) = row.try_get::<chrono::NaiveDate, _>(index) {
                serde_json::Value::String(v.to_string())
            } else if let Ok(v) = row.try_get::<String, _>(index) {
                serde_json::Value::String(v)
            } else {
                serde_json::Value::Null
            }
        }
        "TIME" | "TIMETZ" => {
            if let Ok(v) = row.try_get::<chrono::NaiveTime, _>(index) {
                serde_json::Value::String(v.to_string())
            } else if let Ok(v) = row.try_get::<String, _>(index) {
                serde_json::Value::String(v)
            } else {
                serde_json::Value::Null
            }
        }
        _ => {
            if let Ok(v) = row.try_get::<String, _>(index) {
                serde_json::Value::String(v)
            } else if let Ok(v) = row.try_get::<i64, _>(index) {
                serde_json::Value::Number(v.into())
            } else if let Ok(v) = row.try_get::<f64, _>(index) {
                serde_json::Number::from_f64(v)
                    .map(serde_json::Value::Number)
                    .unwrap_or(serde_json::Value::Null)
            } else if let Ok(v) = row.try_get::<bool, _>(index) {
                serde_json::Value::Bool(v)
            } else {
                serde_json::Value::Null
            }
        }
    }
}
