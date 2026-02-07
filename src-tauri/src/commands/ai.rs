use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::time::Duration;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum AiProvider {
    Openai,
    Deepseek,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AiSettings {
    pub provider: AiProvider,
    pub api_key: String,
    pub model: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ChatCompletionRequest {
    model: String,
    messages: Vec<ChatMessage>,
}

#[derive(Debug, Deserialize)]
struct ChatCompletionResponse {
    choices: Vec<ChatChoice>,
}

#[derive(Debug, Deserialize)]
struct ChatChoice {
    message: ChatMessage,
}

#[derive(Debug, Deserialize)]
struct ApiErrorResponse {
    error: Option<ApiErrorDetail>,
}

#[derive(Debug, Deserialize)]
struct ApiErrorDetail {
    message: Option<String>,
}

fn get_ai_settings_path() -> Result<PathBuf, String> {
    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;
    let dbee_dir = home_dir.join(".dbee");

    if !dbee_dir.exists() {
        fs::create_dir_all(&dbee_dir)
            .map_err(|e| format!("Failed to create .dbee directory: {}", e))?;
    }

    Ok(dbee_dir.join("ai-settings.json"))
}

fn read_ai_settings() -> Result<Option<AiSettings>, String> {
    let path = get_ai_settings_path()?;

    if !path.exists() {
        return Ok(None);
    }

    let content =
        fs::read_to_string(&path).map_err(|e| format!("Failed to read AI settings: {}", e))?;

    let settings: AiSettings = serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse AI settings: {}", e))?;

    Ok(Some(settings))
}

/// Returns settings without the API key for frontend display.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AiSettingsPublic {
    pub provider: AiProvider,
    pub has_api_key: bool,
    pub model: String,
}

#[tauri::command]
pub async fn get_ai_settings() -> Result<Option<AiSettingsPublic>, String> {
    let settings = read_ai_settings()?;
    Ok(settings.map(|s| AiSettingsPublic {
        provider: s.provider,
        has_api_key: !s.api_key.is_empty(),
        model: s.model,
    }))
}

#[tauri::command]
pub async fn save_ai_settings(settings: AiSettings) -> Result<(), String> {
    if settings.model.trim().is_empty() {
        return Err("Model name is required".to_string());
    }
    if settings.model.len() > 100 {
        return Err("Model name is too long".to_string());
    }

    let path = get_ai_settings_path()?;

    let content = serde_json::to_string_pretty(&settings)
        .map_err(|e| format!("Failed to serialize AI settings: {}", e))?;

    fs::write(&path, content).map_err(|e| format!("Failed to write AI settings: {}", e))
}

fn get_api_url(provider: &AiProvider) -> String {
    match provider {
        AiProvider::Openai => "https://api.openai.com/v1/chat/completions".to_string(),
        AiProvider::Deepseek => "https://api.deepseek.com/chat/completions".to_string(),
    }
}

fn parse_api_error(status: reqwest::StatusCode, body: &str) -> String {
    let user_message = serde_json::from_str::<ApiErrorResponse>(body)
        .ok()
        .and_then(|e| e.error)
        .and_then(|e| e.message)
        .unwrap_or_else(|| format!("Request failed with status {}", status));

    user_message
}

#[tauri::command]
pub async fn send_ai_message(messages: Vec<ChatMessage>) -> Result<String, String> {
    let settings = read_ai_settings()?
        .ok_or("AI settings not configured. Open settings to add your API key.")?;

    if settings.api_key.is_empty() {
        return Err("API key is not configured".to_string());
    }

    let url = get_api_url(&settings.provider);

    let request_body = ChatCompletionRequest {
        model: settings.model,
        messages,
    };

    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(60))
        .build()
        .map_err(|e| format!("Failed to create HTTP client: {}", e))?;

    let response = client
        .post(&url)
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", settings.api_key))
        .json(&request_body)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    if !response.status().is_success() {
        let status = response.status();
        let body = response.text().await.unwrap_or_default();
        return Err(parse_api_error(status, &body));
    }

    let completion: ChatCompletionResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse API response: {}", e))?;

    let assistant_message = completion.choices.first().ok_or("No response from API")?;

    Ok(assistant_message.message.content.clone())
}
