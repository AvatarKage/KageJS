import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { resolve } from "@kagejs/native";

import kagejsWiki from "./packages/wiki/src/plugins/kagejsWiki.js";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        kagejsWiki("./public/wiki")
    ],

    root: "src",
    publicDir: resolve("./public"),

    build: {
        outDir: "../docs",
        emptyOutDir: true,

        rolldownOptions: {
            input: resolve("./src/index.html"),

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
