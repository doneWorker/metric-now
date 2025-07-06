use cocoa::appkit::NSMainMenuWindowLevel;
use tauri::{
    tray::{MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent},
    AppHandle,
};
use tauri_nspanel::ManagerExt;

pub fn setup_mac(app_handle: &tauri::AppHandle) {
    create_tray_icon(app_handle);
}

use crate::utils::{position_menubar_panel, swizzle_to_menubar_panel};

pub fn create_tray_icon(app_handle: &AppHandle) -> tauri::Result<TrayIcon> {
    let icon = app_handle.default_window_icon().unwrap().clone();

    TrayIconBuilder::with_id("tray")
        .icon(icon)
        .icon_as_template(true)
        .on_tray_icon_event(|tray, event| {
            let app_handle = tray.app_handle();

            if let TrayIconEvent::Click { button_state, .. } = event {
                if button_state == MouseButtonState::Up {
                    let panel = app_handle.get_webview_panel("overlay").unwrap();

                    if panel.is_visible() {
                        panel.order_out(None);
                        return;
                    }

                    swizzle_to_menubar_panel(app_handle);
                    position_menubar_panel(app_handle, 0.0);

                    panel.set_level(NSMainMenuWindowLevel + 10);
                    panel.show();
                }
            }
        })
        .build(app_handle)
}
