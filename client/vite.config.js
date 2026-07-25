import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-192.png", "icon-512.png", "icon-512-maskable.png", "apple-touch-icon.png"],
      manifest: {
        name: "Velada Parley Tracker",
        short_name: "Parleys",
        description: "Sigue tus parleys de La Velada del Año 6 en vivo",
        display: "standalone",
        orientation: "portrait",
        background_color: "#0B0B0F",
        theme_color: "#0B0B0F",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^\/api\/.*$/i,
            handler: "NetworkFirst",
            options: {
              networkTimeoutSeconds: 3,
              cacheName: "api-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
            },
          },
        ],
      },
    }),
  ],
  server: { port: 5173 },
});
