mod commands;

use commands::{
    connect, delete_connection, disconnect, execute_query, get_ai_settings, get_connection_info,
    get_schema, list_saved_connections, load_editor_tabs, save_ai_settings, save_connection,
    save_editor_tabs, send_ai_message, test_connection, AppState,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let _ = fix_path_env::fix();

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![
            connect,
            disconnect,
            get_connection_info,
            execute_query,
            get_schema,
            list_saved_connections,
            save_connection,
            delete_connection,
            test_connection,
            get_ai_settings,
            save_ai_settings,
            send_ai_message,
            load_editor_tabs,
            save_editor_tabs,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
