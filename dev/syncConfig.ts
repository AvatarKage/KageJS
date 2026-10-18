import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { config } from "../app.config.js";

const dir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)), ".."
);

const { name, author, legal } = config.metadata;

const legalText = legal.text;
const licenseCode = legal.license;

if (!name) throw new Error("app.config.js is missing metadata.name");
if (!legalText) throw new Error("app.config.js is missing metadata.legal.text");

const packagesDir = path.join(dir, "packages");

for (const [packageKey, packageConfig] of Object.entries(config.packages)) {
    const {
        name: packageName,
        version,
        description,
        keywords,
    } = packageConfig;

    if (!packageName) throw new Error(`Missing name for config.packages.${packageKey}`);
    if (!version) throw new Error(`Missing version for config.packages.${packageKey}`);
    if (!description) throw new Error(`Missing description for config.packages.${packageKey}`);
    if (!keywords) throw new Error(`Missing keywords for config.packages.${packageKey}`);

    /* 
    ————————————————————————————————————————————————————————————————
    package.json
    ———————————————————————————————————————————————————————————————— 
    */

    const packagePath = path.join(packagesDir, packageKey, "package.json");

    if (!fs.existsSync(packagePath)) {
        throw new Error(`package.json not found: ${packagePath}`);
    }

    const packageJSON = JSON.parse(
        fs.readFileSync(packagePath, "utf8")
    );

    const headerText = `This file is part of ${name}. ${legalText}`;

    packageJSON.name = packageName;
    packageJSON.version = version;
    packageJSON.description = description;
    packageJSON.keywords = keywords;
    packageJSON.author = author;
    packageJSON.license = licenseCode;

    packageJSON.scripts ??= {};

    packageJSON.scripts.minify =
        `npx esbuild "dist/**/*.js" --format=esm --minify ` +
        `--banner:js="/* ${headerText} */" ` +
        `--outdir=dist --allow-overwrite`;

    fs.writeFileSync(
        packagePath,
        JSON.stringify(packageJSON, null, 2) + "\n",
        "utf8"
    );
}
