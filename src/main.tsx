import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { bootstrapDb, initDb } from "./db";
import { AppStateProvider, ConfirmProvider } from "./shared/providers";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { disableContextMenu } from "./utils";

import "rc-tooltip/assets/bootstrap.css";
import "rc-dropdown/assets/index.css";
import "./styles/utils.scss";
import "./main.css";

async function bootstrap() {
  await bootstrapDb();
  await initDb();
  disableContextMenu();
  startApp();
}
bootstrap();

function startApp() {
  const rootElement = document.getElementById("root") as HTMLElement;
  const root = ReactDOM.createRoot(rootElement);

  return root.render(
    <StrictMode>
      <AppStateProvider>
        <ConfirmProvider>
          <RouterProvider router={router} />
        </ConfirmProvider>
      </AppStateProvider>
    </StrictMode>
  );
}
