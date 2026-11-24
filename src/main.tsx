import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/libre-baskerville/400.css";
import "@fontsource/libre-baskerville/700.css";
import "./styles.css";
import "./sections.css";

// Prerendered pages link to ".../index.html"; normalise before the router reads the address.
if (window.location.protocol !== "file:" && /\/index\.html$/.test(window.location.pathname)) {
  const clean = window.location.pathname.replace(/\/index\.html$/, "") || "/";
  window.history.replaceState(null, "", clean + window.location.search + window.location.hash);
}

const router = getRouter();
const rootElement = document.getElementById("root");
if (rootElement && window.location.protocol !== "file:") {
  rootElement.innerHTML = "";
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
