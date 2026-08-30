use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf};
use tauri::{AppHandle, Manager};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Instance {
    pub id: String,
    pub name: String,
    pub version: String,
    pub loader: String,
    pub java_path: Option<String>,
    pub memory_mb: u32,
}

fn instances_file(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir.join("instances.json"))
}

fn load_instances(app: &AppHandle) -> Result<Vec<Instance>, String> {
    let file = instances_file(app)?;
    if !file.exists() { return Ok(Vec::new()); }
    let data = fs::read_to_string(file).map_err(|e| e.to_string())?;
    serde_json::from_str(&data).map_err(|e| e.to_string())
}

fn save_instances(app: &AppHandle, instances: &[Instance]) -> Result<(), String> {
    let file = instances_file(app)?;
    let data = serde_json::to_string_pretty(instances).map_err(|e| e.to_string())?;
    fs::write(file, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn list_instances(app: AppHandle) -> Result<Vec<Instance>, String> {
    load_instances(&app)
}

#[tauri::command]
pub fn create_instance(
    app: AppHandle,
    name: String,
    version: String,
    loader: String,
) -> Result<Instance, String> {
    let mut instances = load_instances(&app)?;
    let id = format!("{}-{}", name.to_lowercase().replace(|c: char| !c.is_ascii_alphanumeric(), "-"), instances.len() + 1);
    let instance = Instance { id, name, version, loader, java_path: None, memory_mb: 4096 };
    instances.push(instance.clone());
    save_instances(&app, &instances)?;
    Ok(instance)
}

#[tauri::command]
pub fn delete_instance(app: AppHandle, id: String) -> Result<(), String> {
    let mut instances = load_instances(&app)?;
    let original = instances.len();
    instances.retain(|i| i.id != id);
    if instances.len() == original { return Err("Instance not found".into()); }
    save_instances(&app, &instances)
}

#[tauri::command]
pub fn detect_java() -> Option<String> {
    let candidates = if cfg!(target_os = "windows") {
        vec![r"C:\Program Files\Java\jdk-21\bin\javaw.exe", r"C:\Program Files\Java\jdk-21\bin\java.exe"]
    } else {
        vec!["/usr/bin/java", "/usr/lib/jvm/java-21-openjdk/bin/java", "/opt/homebrew/bin/java"]
    };
    candidates.into_iter().find(|p| std::path::Path::new(p).exists()).map(String::from)
}

#[tauri::command]
pub fn app_version() -> &'static str { "1.0.0" }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![list_instances, create_instance, delete_instance, detect_java, app_version])
        .run(tauri::generate_context!())
        .expect("error while running Specked Launcher");
}
