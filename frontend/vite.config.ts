import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      // this proxy forwards any requests starting with /api to the backend server running on port 5000
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
});
