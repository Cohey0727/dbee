use serde::{Deserialize, Serialize};
use sqlx::postgres::PgPool;
use std::fs;
use std::path::PathBuf;
use uuid::Uuid;

use super::connection::{build_connection_string, ConnectionConfig};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SavedConnection {
    pub id: String,
    pub name: String,
    pub host: String,
    pub port: u16,
    pub user: String,
    pub password: String,
    pub database: String,
}

impl From<SavedConnection> for ConnectionConfig {
    fn from(saved: SavedConnection) -> Self {
        Self {
            id: saved.id,
            name: saved.name,
            host: saved.host,
            port: saved.port,
            user: saved.user,
            password: saved.password,
            database: saved.database,
        }
    }
}

impl From<ConnectionConfig> for SavedConnection {
    fn from(config: ConnectionConfig) -> Self {
        Self {
            id: config.id,
            name: config.name,
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
struct ConnectionsFile {
    connections: Vec<SavedConnection>,
}

fn get_connections_file_path() -> Result<PathBuf, String> {
    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;
    let dbee_dir = home_dir.join(".dbee");

    if !dbee_dir.exists() {
        fs::create_dir_all(&dbee_dir)
            .map_err(|e| format!("Failed to create .dbee directory: {}", e))?;
    }

    Ok(dbee_dir.join("connections.json"))
}

fn read_connections_file() -> Result<ConnectionsFile, String> {
    let path = get_connections_file_path()?;

    if !path.exists() {
        return Ok(ConnectionsFile::default());
    }

    let content =
        fs::read_to_string(&path).map_err(|e| format!("Failed to read connections file: {}", e))?;

    serde_json::from_str(&content).map_err(|e| format!("Failed to parse connections file: {}", e))
}

fn write_connections_file(file: &ConnectionsFile) -> Result<(), String> {
    let path = get_connections_file_path()?;

    let content = serde_json::to_string_pretty(file)
        .map_err(|e| format!("Failed to serialize connections: {}", e))?;

    fs::write(&path, content).map_err(|e| format!("Failed to write connections file: {}", e))
}

#[tauri::command]
pub async fn list_saved_connections() -> Result<Vec<SavedConnection>, String> {
    let file = read_connections_file()?;
    Ok(file.connections)
}

#[tauri::command]
pub async fn save_connection(mut connection: SavedConnection) -> Result<SavedConnection, String> {
    let mut file = read_connections_file()?;

    if connection.id.is_empty() {
        connection.id = Uuid::new_v4().to_string();
        file.connections.push(connection.clone());
    } else {
        let existing_index = file.connections.iter().position(|c| c.id == connection.id);
        match existing_index {
            Some(index) => {
                file.connections[index] = connection.clone();
            }
            None => {
                file.connections.push(connection.clone());
            }
        }
    }

    write_connections_file(&file)?;
    Ok(connection)
}

#[tauri::command]
pub async fn delete_connection(id: String) -> Result<(), String> {
    let mut file = read_connections_file()?;
    file.connections.retain(|c| c.id != id);
    write_connections_file(&file)?;
    Ok(())
}

#[tauri::command]
pub async fn test_connection(connection: SavedConnection) -> Result<bool, String> {
    let config: ConnectionConfig = connection.into();
    config.validate()?;

    let connection_string = build_connection_string(&config);

    match PgPool::connect(&connection_string).await {
        Ok(pool) => {
            pool.close().await;
            Ok(true)
        }
        Err(e) => Err(format!("Connection failed: {}", e)),
    }
}
