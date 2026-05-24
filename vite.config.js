import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",
      
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        // Never let workbox touch these binary/ML files
        globIgnores: [
          '**/mediapipe-pose/**',
          '**/*.wasm',
          '**/*.tflite',
          '**/*.bin',
          '**/*.data',
          '**/*.pb',
          '**/*.binarypb',
        ],
        navigateFallback: '/index.html',
        // Only use navigateFallback for actual page routes, not assets
        navigateFallbackDenylist: [
          /^\/mediapipe-pose\//,
          /\.(wasm|tflite|bin|data|pb|binarypb|js|css|png|ico|svg|jpg|webp)$/,
        ],
      },

      manifest: {
        name: "FitCoach",
        short_name: "FitCoach",
        start_url: "/",
        display: "standalone",
        background_color: "#070617",
        theme_color: "#070617",
        icons: [
          {
            src: "/Logo192.png", // ← capital L, match your actual filename
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/Logo512.png", // ← capital L
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