use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};

#[cfg(target_os = "macos")]
mod tray;
#[cfg(target_os = "macos")]
use {
    crate::tray::hide_overlay,
    cocoa::appkit::NSWindowCollectionBehavior,
    tauri::TitleBarStyle,
    tauri_nspanel::{panel_delegate, WebviewWindowExt},
};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

pub fn run() {
    let mut builder = tauri::Builder::default();

    #[cfg(target_os = "macos")]
    {
        builder = builder.plugin(tauri_nspanel::init());
    }

    builder
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .setup(|app| {
            let win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
                .min_inner_size(1000.0, 800.0)
                .devtools(false)
                .hidden_title(true);

            // Create Tray
            #[cfg(target_os = "macos")]
            {
                use tauri::{utils::config::WindowEffectsConfig, window::Effect};

                app.handle()
                    .plugin(tauri_plugin_positioner::init())
                    .unwrap();

                tauri::WebviewWindowBuilder::new(
                    app,
                    "overlay",
                    tauri::WebviewUrl::App("overlay.html".into()),
                )
                .visible(false)
                .transparent(true)
                .effects(WindowEffectsConfig {
                    effects: vec![Effect::HudWindow, Effect::Acrylic],
                    color: None,
                    state: None,
                    radius: Some(16.0),
                })
                .inner_size(300.0, 300.0)
                .devtools(false)
                .decorations(false)
                .always_on_top(true)
                .resizable(false)
                .skip_taskbar(true)
                .visible_on_all_workspaces(true)
                .build()?;

                init_overlay(app.app_handle());
                tray::create(app.app_handle())?;
            }

            // set transparent title bar only when building for macOS
            #[cfg(target_os = "macos")]
            let win_builder = win_builder.title_bar_style(TitleBarStyle::Overlay);
            let window = win_builder.build().unwrap();

            // set background color only when building for macOS
            #[cfg(target_os = "macos")]
            {
                use cocoa::appkit::{NSColor, NSWindow};
                use cocoa::base::{id, nil};

                let ns_window = window.ns_window().unwrap() as id;
                unsafe {
                    let bg_color = NSColor::colorWithRed_green_blue_alpha_(
                        nil,
                        50.0 / 255.0,
                        158.0 / 255.0,
                        163.5 / 255.0,
                        1.0,
                    );
                    ns_window.setBackgroundColor_(bg_color);
                }
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(target_os = "macos")]
fn init_overlay(app_handle: &AppHandle) {
    let window = app_handle.get_webview_window("overlay").unwrap();
    let panel = window.to_panel().unwrap();

    let delegate = panel_delegate!(MyPanelDelegate {
        window_did_become_key,
        window_did_resign_key
    });

    let handle = app_handle.to_owned();

    delegate.set_listener(Box::new(move |delegate_name: String| {
        match delegate_name.as_str() {
            "window_did_become_key" => {
                let app_name = handle.package_info().name.to_owned();

                println!("[info]: {:?} panel becomes key window!", app_name);
            }
            "window_did_resign_key" => {
                hide_overlay(&handle);
                println!("[info]: panel resigned from key window!");
            }
            _ => (),
        }
    }));

    // Set the window to float level
    #[allow(non_upper_case_globals)]
    const NSFloatWindowLevel: i32 = 4;
    panel.set_level(NSFloatWindowLevel);

    #[allow(non_upper_case_globals)]
    const NSWindowStyleMaskNonActivatingPanel: i32 = 1 << 7;
    // Ensures the panel cannot activate the app
    panel.set_style_mask(NSWindowStyleMaskNonActivatingPanel);

    // Allows the panel to:
    // - display on the same space as the full screen window
    // - join all spaces
    panel.set_collection_behaviour(
        NSWindowCollectionBehavior::NSWindowCollectionBehaviorFullScreenAuxiliary
            | NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces,
    );

    panel.set_delegate(delegate);
}
