```ts

 can support multiple wkiis or docs whatever
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        generateIndex("./public/wiki"),
        generateIndex("./public/old_wiki")
    ],

```
