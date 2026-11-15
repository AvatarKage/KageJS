import type { Plugin } from "vite";
import chokidar from "chokidar";

import { assert } from "@kagejs/utilities";
import { Folder, File, resolve } from "@kagejs/native";

import { WikiProperties } from "../../types/wiki.type.js";
import parseProperties from "../helpers/parseProperties.js";

function generateIndex(dir: string) {
    assert(dir).isDefined();

    const path = resolve(dir);
    
    const inputDirectory = Folder.open(path);

    const wikiIndex: WikiProperties[] = [];

    function scanFolder(folder: Folder): void {
        for (const file of folder.files()) {
            if (file.extension.toLowerCase() === ".md") {
                wikiIndex.push({
                    slug: file
                        .path.replace(path, "")
                        .replace(file.extension, ""),
                    ...parseProperties(file.read())
                });
            }
        }

        for (const subfolder of folder.folders()) {
            scanFolder(subfolder);
        }
    }

    scanFolder(inputDirectory);

    console.log(
        `[@kagejs/wiki] Found ${wikiIndex.length} wiki page${wikiIndex.length !== 1 ? "s" : ""} in "${inputDirectory.name}"`
    );

    const outputPath = resolve(`${dir}/_generated`);

    const outputFolder = Folder.open(outputPath);

    if (!outputFolder.exists()) {
        outputFolder.create();
    }

    const outputFile = File.open(`${outputPath}/index.json`);

    if (!outputFile.exists()) {
        outputFile.create();
    }

    outputFile.write(
        `${JSON.stringify(wikiIndex, null, 2)}\n`
    );
}

/**
 * Generates a wiki index by scanning Markdown files from a 
 * directory and writing the index in the _generated folder.
 * Automatically refreshes page on live editing.
 *
 * @param dir Directory containing the wiki Markdown pages.
 */
export default function kagejsWiki(dir: string): Plugin {
    return {
        name: "@kagejs/wiki",

        configureServer(server) {
            const watcher = chokidar.watch(dir, {
                ignored: [
                    "**/_generated/**",
                    "**/node_modules/**",
                ],
                ignoreInitial: true,
                awaitWriteFinish: {
                    stabilityThreshold: 100,
                    pollInterval: 50,
                },
            });

            watcher.on("all", (_event, filePath) => {
                if (!filePath.toLowerCase().endsWith(".md")) return;

                generateIndex(dir);

                server.ws.send({
                    type: "custom",
                    event: "kagejs:wiki-update",
                    data: {},
                });
            });

            server.httpServer?.once("close", () => {
                watcher.close();
            });
        },

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        handleHotUpdate({ file, server, modules }) {
            if (!file.toLowerCase().endsWith(".md")) return;

            return modules;
        },
    };
}
