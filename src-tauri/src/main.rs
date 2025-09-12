// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    #[cfg(target_os = "linux")]
    unsafe {
        // Not unsafe if you don't use edition 2024
        std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
    }
    calendar_app_lib::run()
}
