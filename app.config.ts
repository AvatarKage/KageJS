/* 
————————————————————————————————————————————————————————————————
This is the ONLY config files you should be edting. The rest are 
either importing this file or updated via the sync command.

DO NOT EDIT THE FOLLOWING FILES:
- ./package.json
- ./eslint.config.js
- ./tsconfig.json
- ./vite.config.ts

———————————————————————————————————————————————————————————————— 
QUICK CONFIG
———————————————————————————————————————————————————————————————— 
*/

// Major version change that effects all the packages. This
// should only be updated if a full rewrite is ever in order.
const kagejsVersion = "2" // major

// Minor versions should be updated anytime a new file such as a
// class, component, helper, service, etc. is introduced. Patch
// versions should be updated anytime a small tweak is made that
// fixes an issue or doesn't introduce anything new.
const utilitiesVersion = "6.1" // minor.patch
const nativeVersion = "0.1" // minor.patch
const uiVersion = "0.0" // minor.patch
const cliVersion = "0.0" // minor.patch
const wikiVersion = "0.0" // minor.patch
const automodVersion = "0.0" // minor.patch

// MERGE ENV HERE AND MAKE app.config.ts.example; keep .env on its own

/* 
————————————————————————————————————————————————————————————————
FULL CONFIG
———————————————————————————————————————————————————————————————— 
*/

const name = "KageJS";
const keywords = ["kagejs", "typescript", "javascript"];
const author = "AvatarKage";
const license = "MIT";

export const config = {
    // https://nerdfonts.com
    useNerdFonts: true,

    packages: {
        utilities: {
            name: "@kagejs/utilities",
            version: `${kagejsVersion}.${utilitiesVersion}`,
            description: "Includes various common extensions and helpers for the KageJS ecosystem.",
            keywords: [
                ...keywords, 
                "utilities", "utils", "tools", "helpers", "extensions"
            ]
        },
        native: {
            name: "@kagejs/native",
            version: `${kagejsVersion}.${nativeVersion}`,
            description: "Provides native system utilities, filesystem management, and system information.",
            keywords: [
                ...keywords,
                "utilities", "utils", "tools", "helpers", "native", 
                "system", "system-info", "system-information", 
                "filesystem", "file-management","directory"
            ]
        },
        ui: {
            name: "@kagejs/ui",
            version: `${kagejsVersion}.${uiVersion}`,
            description: "A React component library using Tailwind CSS.",
            keywords: [
                ...keywords,
                "react", "components", "tailwind", "elements"
            ]
        },
        cli: {
            name: "@kagejs/cli",
            version: `${kagejsVersion}.${cliVersion}`,
            description: "KageJS commands.",
            keywords: [
                ...keywords,
                "cli", "commands", "build"
            ]
        },
        wiki: {
            name: "@kagejs/wiki",
            version: `${kagejsVersion}.${wikiVersion}`,
            description: "A serverless Markdown powered wiki.",
            keywords: [
                ...keywords,
                "wiki", "docs", "article"
            ]
        },
        automod: {
            name: "@kagejs/automod",
            version: `${kagejsVersion}.${automodVersion}`,
            description: "A highly resilient auto-moderation module.",
            keywords: [
                ...keywords,
                "automod", "automoderation", "moderation", "moderator",
                "moderation-tools", "security", "safety", "content-filter",
                "content-moderation", "profanity-filter", "spam-detection",
                "obfuscation", "regex", "filtering"
            ]
        }
    },

    metadata: {
        name,
        author,
        legal: {
            license,
            text: `Copyright (c) ${new Date().getFullYear()} ${author}. Released under the ${license} license.`
        }
    }

} as const;

export type Config = typeof config;
