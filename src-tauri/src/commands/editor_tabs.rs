use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PersistedTab {
    pub id: String,
    pub name: String,
    pub content: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PersistedEditorState {
    pub tabs: Vec<PersistedTab>,
    pub active_tab_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
struct EditorTabsFile {
    connections: HashMap<String, PersistedEditorState>,
}

fn get_editor_tabs_file_path() -> Result<PathBuf, String> {
    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;
    let dbee_dir = home_dir.join(".dbee");

    if !dbee_dir.exists() {
        fs::create_dir_all(&dbee_dir)
            .map_err(|e| format!("Failed to create .dbee directory: {}", e))?;
    }

    Ok(dbee_dir.join("editor-tabs.json"))
}

fn read_editor_tabs_file() -> Result<EditorTabsFile, String> {
    let path = get_editor_tabs_file_path()?;

    if !path.exists() {
        return Ok(EditorTabsFile::default());
    }

    let content = fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read editor tabs file: {}", e))?;

    serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse editor tabs file: {}", e))
}

fn write_editor_tabs_file(file: &EditorTabsFile) -> Result<(), String> {
    let path = get_editor_tabs_file_path()?;

    let content = serde_json::to_string_pretty(file)
        .map_err(|e| format!("Failed to serialize editor tabs: {}", e))?;

    fs::write(&path, content).map_err(|e| format!("Failed to write editor tabs file: {}", e))
}

#[tauri::command]
pub async fn load_editor_tabs(
    connection_id: String,
) -> Result<Option<PersistedEditorState>, String> {
    let file = read_editor_tabs_file()?;
    Ok(file.connections.get(&connection_id).cloned())
}

#[tauri::command]
pub async fn save_editor_tabs(
    connection_id: String,
    state: PersistedEditorState,
) -> Result<(), String> {
    let mut file = read_editor_tabs_file()?;
    file.connections.insert(connection_id, state);
    write_editor_tabs_file(&file)
}
