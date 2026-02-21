import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            devOptions: {
                enabled: true,
            },
            workbox: {
                maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MiB
                globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
            },
            manifest: {
                name: "AGOS",
                short_name: "AGOS",
                display: "fullscreen",
                background_color: "#ffffff",
                theme_color: "#ffffff",
                icons: [
                    {
                        src: "/agos.png",
                        sizes: "1000x1000",
                        type: "image/png",
                    },
                ],
            },
        }),
    ],
});
