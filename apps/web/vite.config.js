import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import config from "@quick-bite/app-config";
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": `http://localhost:${config.API_PORT}`,
    },
  },
});
