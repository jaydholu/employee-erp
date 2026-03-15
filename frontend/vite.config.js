import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), "");

  const API_BASE = env.VITE_API_URL;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/auth": API_BASE,
        "/employees": API_BASE,
        "/performance": API_BASE,
      },
    },
  };
});