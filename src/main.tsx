import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import "./i18n/i18n";
import "./styles/app.css";
import { getSavedPalette, setPalette } from "./palette";

import { applyTheme, getInitialTheme } from "./theme";

// Apply theme ASAP to reduce flash
applyTheme(getInitialTheme());

const saved = getSavedPalette();
setPalette(saved.id, saved.customAccent);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);