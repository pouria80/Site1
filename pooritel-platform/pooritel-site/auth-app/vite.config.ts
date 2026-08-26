import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Builds straight into the Cloudflare Worker's static-assets folder
// (../public/auth) so `wrangler deploy` picks it up automatically.
// The app is served at /auth/ — see base below.
export default defineConfig({
  plugins: [react()],
  base: "/auth/",
  build: {
    outDir: "../public/auth",
    emptyOutDir: true,
  },
});
