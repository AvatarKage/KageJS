/* 
————————————————————————————————————————————————————————————————
This and ./env are the ONLY config files you should be edting. 
The rest are either importing this file or updated via the sync 
command. When the translate command is ran the metadata.locale 
file will be translated to all generation.translations.

DO NOT EDIT THE FOLLOWING FILES:
- ./package.json
- ./eslint.config.js
- ./tsconfig.json
- ./vite.config.ts

———————————————————————————————————————————————————————————————— 
QUICK CONFIG
———————————————————————————————————————————————————————————————— 
*/

const semver = "0.1.0"; // major.minor.patch
const stage = "dev"; // prealpha | alpha | beta | rc | release
const build = "build-6775774"; // DO NOT TOUCH, AUTO-GENERATED
const buildDate = "2026-10-16T18:34:28.630Z"; // DO NOT TOUCH, AUTO-GENERATED

/* 
————————————————————————————————————————————————————————————————
FULL CONFIG
———————————————————————————————————————————————————————————————— 
*/

export const config = {
    // https://nerdfonts.com
    useNerdFonts: true,

    // Sends debug logs
    debug: {
        config: false,
        snowflake: false,

        // Save all logs to file
        logger: {
            main: false,
            status: false,
            api: false,
            cdn: false,
            support: false
        }
    },

    theme: {
        primary: "#080808",
        accent: "#7b22fd"
    },

    metadata: {
        id: "com.avatarkage.sonarUI",
        name: "sonarUI",
        description: "A React component library using Tailwind CSS",
        keywords: ["ui", "react", "tailwind"],
        urls: [
            "https://avatarkage.com"
        ],

        version: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            full: `${stage === "release" ? semver : [semver, stage, build].filter(Boolean).join("-")}`,
            semver,
            stage,
            build,
            buildDate
        },

        // Relative to the ./public folder
        assets: {
            logo: "/branding/logo.svg",
            icon: "/branding/icon.svg",
            banner: "/branding/banner.png"
        },

        legal: {
            owner: "AvatarKage", // Include suffix for registered entity
            license: {
                text: "Copyright (c) 2026 AvatarKage. Released under the MIT license.", // https://choosealicense.com
                code: "MIT", // https://choosealicense.com
            },
            trademarks: [] // Include ™ or (TM) for trademarks, OR ® or (R) for registered trademarks
        },

        contact: {
            admin: "admin@avatarkage.com"
        }
    }
} as const;

export type Config = typeof config;
