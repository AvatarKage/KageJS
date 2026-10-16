import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],

    root: "src",

    build: {
        outDir: "../dist/src",
        emptyOutDir: true,

        rolldownOptions: {
            input: resolve(import.meta.dirname, "src/index.html"),

            output: {
                entryFileNames: "assets/[hash].js",
                chunkFileNames: "assets/[hash].js",
                assetFileNames: "assets/[hash][extname]"
            }
        }
    },

    server: {
        port: 5173
    }
});
