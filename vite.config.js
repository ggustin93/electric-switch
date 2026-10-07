import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// Preact (≈ 4 ko) remplace React : `react` et `react-dom` sont aliasés vers preact/compat
export default defineConfig({ plugins: [preact()] });
