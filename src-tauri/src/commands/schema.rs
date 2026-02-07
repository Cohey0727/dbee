use sqlx::Row;
use tauri::State;

use super::connection::AppState;

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ColumnSchema {
    pub name: String,
    pub data_type: String,
    pub nullable: bool,
    pub is_primary_key: bool,
}

#[derive(Debug, serde::Serialize)]
pub struct TableSchema {
    pub name: String,
    pub columns: Vec<ColumnSchema>,
}

#[derive(Debug, serde::Serialize)]
pub struct DatabaseSchema {
    pub tables: Vec<TableSchema>,
    pub views: Vec<TableSchema>,
}

async fn fetch_columns(
    pool: &sqlx::PgPool,
    table_name: &str,
) -> Result<Vec<ColumnSchema>, String> {
    let columns_query = r#"
        SELECT
            c.column_name,
            c.data_type,
            c.is_nullable,
            CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END as is_primary_key
        FROM information_schema.columns c
        LEFT JOIN (
            SELECT kcu.column_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name
                AND tc.table_schema = kcu.table_schema
            WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name = $1
            AND tc.table_schema = 'public'
        ) pk ON c.column_name = pk.column_name
        WHERE c.table_name = $1
        AND c.table_schema = 'public'
        ORDER BY c.ordinal_position
    "#;

    let column_rows: Vec<_> = sqlx::query(columns_query)
        .bind(table_name)
        .fetch_all(pool)
        .await
        .map_err(|e| format!("Failed to get columns for {}: {}", table_name, e))?;

    let columns = column_rows
        .iter()
        .map(|row| {
            let name: String = row.try_get("column_name").unwrap_or_default();
            let data_type: String = row.try_get("data_type").unwrap_or_default();
            let is_nullable: String = row.try_get("is_nullable").unwrap_or_default();
            let is_primary_key: bool = row.try_get("is_primary_key").unwrap_or(false);

            ColumnSchema {
                name,
                data_type,
                nullable: is_nullable == "YES",
                is_primary_key,
            }
        })
        .collect();

    Ok(columns)
}

async fn fetch_relations(
    pool: &sqlx::PgPool,
    table_type: &str,
) -> Result<Vec<TableSchema>, String> {
    let query = r#"
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = $1
        ORDER BY table_name
    "#;

    let rows: Vec<_> = sqlx::query(query)
        .bind(table_type)
        .fetch_all(pool)
        .await
        .map_err(|e| format!("Failed to get {}: {}", table_type, e))?;

    let mut result = Vec::new();

    for row in rows {
        let name: String = row
            .try_get("table_name")
            .map_err(|e| format!("Failed to get table name: {}", e))?;

        let columns = fetch_columns(pool, &name).await?;
        result.push(TableSchema { name, columns });
    }

    Ok(result)
}

#[tauri::command]
pub async fn get_schema(state: State<'_, AppState>) -> Result<DatabaseSchema, String> {
    let guard = state.pool.lock().await;
    let pool = guard.as_ref().ok_or("Not connected to a database")?;

    let tables = fetch_relations(pool, "BASE TABLE").await?;
    let views = fetch_relations(pool, "VIEW").await?;

    Ok(DatabaseSchema { tables, views })
}
