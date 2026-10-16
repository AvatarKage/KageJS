import { randomBytes } from "crypto";
import path, { resolve } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

import { config } from "../app.config.js";

const primary = config.theme.primary;
const accent = config.theme.accent;
const id = config.metadata.id;
const name = config.metadata.name;
const semver = config.metadata.version.semver;
const stage = config.metadata.version.stage;
const fullVersion = config.metadata.version.full;
const icon = config.metadata.assets.icon;
const owner = config.metadata.legal.owner;
const licenseText = config.metadata.legal.license.text;
const licenseCode = config.metadata.legal.license.code;
const keywords = config.metadata.keywords;

if (!primary) throw new Error("app.config.js is missing theme.primary");
if (!accent) throw new Error("app.config.js is missing theme.accent");
if (!id) throw new Error("app.config.js is missing metadata.!id");
if (!name) throw new Error("app.config.js is missing metadata.name");
if (!semver) throw new Error("app.config.js is missing metadata.version.semver");
if (!stage) throw new Error("app.config.js is missing metadata.version.stage");
if (!fullVersion) throw new Error("app.config.js is missing metadata.version.full");
if (!icon) throw new Error("app.config.js is missing metadata.assets.icon");
if (!owner) throw new Error("app.config.js is missing metadata.legal.owner");
if (!licenseText) throw new Error("app.config.js is missing metadata.legal.license.text");
if (!licenseCode) throw new Error("app.config.js is missing metadata.legal.license.code");

const formattedName = name
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-z0-9-]/g, "");

/* 
————————————————————————————————————————————————————————————————
app.config.js
———————————————————————————————————————————————————————————————— 
*/

const configPath = path.join(resolve(dir), "app.config.ts");
let rawConfig = fs.readFileSync(configPath, "utf8");

rawConfig = rawConfig.replace(
    /const\s+build\s*=\s*".*?"/,
    `const build = "build-${randomBytes(4).toString("hex").slice(0, 7)}"`
);

rawConfig = rawConfig.replace(
    /const\s+buildDate\s*=\s*".*?"/,
    `const buildDate = "${new Date().toISOString()}"`
);

fs.writeFileSync(configPath, rawConfig, "utf8");

/* 
————————————————————————————————————————————————————————————————
package.json
———————————————————————————————————————————————————————————————— 
*/

const packagePath = path.join(resolve(dir), "package.json");
const packageJSON = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const headerText = `This file is part of ${name}. ${licenseText}`;

packageJSON.name = formattedName
packageJSON.version = fullVersion;
packageJSON.description = config.metadata.description;
packageJSON.keywords = keywords;
packageJSON.author = owner;
packageJSON.license = licenseCode;
packageJSON.scripts.minify = `npx esbuild "dist/**/*.js" --format=esm --minify --banner:js="/* ${headerText} */" --outdir=dist --allow-overwrite`;

fs.writeFileSync(packagePath, JSON.stringify(packageJSON, null, 2), "utf8");

/* 
————————————————————————————————————————————————————————————————
package/package.json
———————————————————————————————————————————————————————————————— 
*/

const nodePackagePath = path.join(resolve(dir), "package", "package.json");
const nodePackageJSON = JSON.parse(fs.readFileSync(nodePackagePath, "utf8"));

nodePackageJSON.name = formattedName
nodePackageJSON.version = fullVersion;
nodePackageJSON.description = config.metadata.description;
nodePackageJSON.keywords = keywords;
nodePackageJSON.author = owner;
nodePackageJSON.license = licenseCode;

fs.writeFileSync(nodePackagePath, JSON.stringify(nodePackageJSON, null, 2), "utf8");
