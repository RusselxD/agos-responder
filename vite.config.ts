import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            strategies: "injectManifest",
            srcDir: "public",
            filename: "sw.js",
            devOptions: {
                enabled: true,
            },
            injectManifest: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
                maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MiB
            },
            manifest: {
                name: "AGOS",
                short_name: "AGOS",
                display: "standalone",
                scope: "/",
                start_url: "/",
                id: "/",
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
