import { config, defineConfig } from "../packages/core/src/functions/defineConfig.js";

export default defineConfig({
    metadata: {
        name: "My App"
    }
});

console.log(config.metadata.name);

// Needs a custom build code so define config can be called when the server starts
// Something like kagejs dev
