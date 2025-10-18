import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root")!;

// Check if root has SSR content (has children)
if (rootElement.hasChildNodes()) {
  // Hydrate existing SSR content
  hydrateRoot(rootElement, <App />);
} else {
  // No SSR content, render normally (for admin/static pages)
  createRoot(rootElement).render(<App />);
}
