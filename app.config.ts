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
const utilitiesVersion = "2.2" // minor.patch

/* 
————————————————————————————————————————————————————————————————
FULL CONFIG
———————————————————————————————————————————————————————————————— 
*/

const name = "KageJS";
const keywords = ["kagejs"];
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
                "utilities", "utils", "tools", "helpers", "extensions", "typescript", "javascript"
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
