import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 5173,
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                changeOrigin: true,
                // /types/auth/login  ->  http://localhost:5000/auth/login
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
    css: {
        devSourcemap: true,
    },
    resolve: {
        alias: {
            "@": "/src",
        },
    },
})
