import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { handleRequest } from "./src/api";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: true,
    proxy: {},
    middleware: async (req, res, next) => {
      if (req.url?.startsWith("/api/")) {
        const response = await handleRequest(req as unknown as Request);
        if (response) {
          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            res.setHeader(key, value);
          });
          res.end(await response.text());
          return;
        }
      }
      next();
    },
  },
});
