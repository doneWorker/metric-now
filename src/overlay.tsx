import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { bootstrapDb } from "./db";
import { OverlayWrapper } from "./modules/tray-overlay";
import { disableContextMenu } from "./utils";

import "rc-tooltip/assets/bootstrap.css";
import "rc-dropdown/assets/index.css";
import "./styles/utils.scss";

async function bootstrap() {
  await bootstrapDb();
  disableContextMenu();
  startApp();
}
bootstrap();

function startApp() {
  const rootElement = document.getElementById("root") as HTMLElement;
  const root = ReactDOM.createRoot(rootElement);

  return root.render(
    <StrictMode>
      <OverlayWrapper />
    </StrictMode>
  );
}
