use tauri::{
    tray::{MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager,
};

#[cfg(target_os = "macos")]
use tauri_nspanel::{
    objc_id::{Id, Shared},
    raw_nspanel::RawNSPanel,
    ManagerExt,
};
use tauri_plugin_positioner::{Position, WindowExt};

pub fn create(app_handle: &AppHandle) -> tauri::Result<TrayIcon> {
    let icon = app_handle.default_window_icon().unwrap().clone();

    TrayIconBuilder::with_id("tray")
        .icon(icon)
        .icon_as_template(true)
        .on_tray_icon_event(|tray, event| {
            let app_handle = tray.app_handle();
            tauri_plugin_positioner::on_tray_event(app_handle, &event);

            if let TrayIconEvent::Click { button_state, .. } = event {
                if button_state == MouseButtonState::Up {
                    toggle_overlay(app_handle);
                }
            }
        })
        .build(app_handle)
}

pub fn get_panel(app_handle: &AppHandle) -> Id<RawNSPanel, Shared> {
    let panel = app_handle.get_webview_panel("overlay").unwrap();
    return panel;
}

pub fn toggle_overlay(app_handle: &AppHandle) {
    let panel = get_panel(app_handle);

    if panel.is_visible() {
        hide_overlay(app_handle);
    } else {
        show_overlay(app_handle);
    }
}

pub fn show_overlay(app_handle: &AppHandle) {
    let window = app_handle.get_webview_window("overlay").unwrap();
    let panel = get_panel(app_handle);

    window
        .as_ref()
        .window()
        .move_window(Position::TrayBottomCenter)
        .unwrap();

    panel.show();
}

pub fn hide_overlay(app_handle: &AppHandle) {
    let panel = app_handle.get_webview_panel("overlay").unwrap();

    panel.order_out(None);
}
