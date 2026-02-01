mod commands;

use commands::{
    connect, delete_connection, disconnect, execute_query, get_connection_info, get_schema,
    list_saved_connections, save_connection, test_connection, AppState,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
