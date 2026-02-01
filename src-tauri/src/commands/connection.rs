use sqlx::postgres::PgPool;
use std::sync::Arc;
use tauri::State;
use tokio::sync::Mutex;
use urlencoding::encode;

pub struct AppState {
    pub pool: Arc<Mutex<Option<PgPool>>>,
    pub current_connection: Arc<Mutex<Option<ConnectionConfig>>>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            pool: Arc::new(Mutex::new(None)),
            current_connection: Arc::new(Mutex::new(None)),
        }
    }
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct ConnectionConfig {
    pub id: String,
    pub name: String,
    pub host: String,
    pub port: u16,
    pub user: String,
    pub password: String,
    pub database: String,
}

impl ConnectionConfig {
    pub fn validate(&self) -> Result<(), String> {
        if self.host.is_empty() {
            return Err("Host cannot be empty".to_string());
        }
        if self.port == 0 {
            return Err("Invalid port number".to_string());
        }
        if self.user.is_empty() {
            return Err("User cannot be empty".to_string());
        }
        if self.database.is_empty() {
            return Err("Database name cannot be empty".to_string());
        }
        Ok(())
    }
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ConnectionInfo {
    pub id: String,
    pub name: String,
    pub host: String,
    pub port: u16,
    pub database: String,
    pub is_connected: bool,
}

impl From<&ConnectionConfig> for ConnectionInfo {
    fn from(config: &ConnectionConfig) -> Self {
        Self {
            id: config.id.clone(),
            name: config.name.clone(),
            host: config.host.clone(),
            port: config.port,
            database: config.database.clone(),
            is_connected: true,
        }
    }
}

pub fn build_connection_string(config: &ConnectionConfig) -> String {
    format!(
        "postgres://{}:{}@{}:{}/{}",
        encode(&config.user),
        encode(&config.password),
        config.host,
        config.port,
        encode(&config.database)
    )
}

#[tauri::command]
pub async fn connect(
    config: ConnectionConfig,
    state: State<'_, AppState>,
) -> Result<ConnectionInfo, String> {
    config.validate()?;

    let connection_string = build_connection_string(&config);

    let pool = PgPool::connect(&connection_string)
        .await
        .map_err(|e| format!("Failed to connect: {}", e))?;

    let info = ConnectionInfo::from(&config);

    {
        let mut guard = state.pool.lock().await;
        *guard = Some(pool);
    }

    {
        let mut config_guard = state.current_connection.lock().await;
        *config_guard = Some(config);
    }

    Ok(info)
}

#[tauri::command]
pub async fn disconnect(state: State<'_, AppState>) -> Result<(), String> {
    let mut guard = state.pool.lock().await;
    if let Some(pool) = guard.take() {
        pool.close().await;
    }

    let mut config_guard = state.current_connection.lock().await;
    *config_guard = None;

    Ok(())
}

#[tauri::command]
pub async fn get_connection_info(
    state: State<'_, AppState>,
) -> Result<Option<ConnectionInfo>, String> {
    let pool_guard = state.pool.lock().await;
    let config_guard = state.current_connection.lock().await;

    if pool_guard.is_some() {
        if let Some(config) = config_guard.as_ref() {
            return Ok(Some(ConnectionInfo::from(config)));
        }
    }

    Ok(None)
}
