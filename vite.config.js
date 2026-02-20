import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Hotel Booking Platform',
        short_name: 'HotelBooking',
        start_url: '.',
        display: 'standalone',
        background_color: '#f9fafb',
        theme_color: '#7c3aed',
        description: 'Book hotels, manage bookings, and explore destinations.',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      srcDir: 'src',
      filename: 'service-worker.js',
    }),
  ],
});
