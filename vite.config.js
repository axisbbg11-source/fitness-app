import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "ReelBosster",
        short_name: "ReelBosster",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#000000",

        icons: [
          {
            src: "/logo192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],

  build: {
    chunkSizeWarningLimit: 1000,
  },
});