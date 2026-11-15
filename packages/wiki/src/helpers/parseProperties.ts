import { PageMetadata } from "@kagejs/ui";

import { WikiProperties } from "../../types/wiki.type.js";

function extractBlock(source: string, name: string): string {
    return source.match(
        new RegExp(`<!--${name}\\s*([\\s\\S]*?)-->`, "i")
    )?.[1]?.trim() ?? "";
}

function parseFields(source: string): Record<string, string | boolean> {
    const result: Record<string, string | boolean> = {};

    for (const line of source.split("\n")) {
        const match = line.match(/^([^:]+):\s*(.*)$/);

        if (!match) continue;

        const key = match[1].trim();
        const value = match[2].trim().replace(/,$/, "");

        result[key] =
            value === "true" ? true :
            value === "false" ? false :
            value.replace(/^["']|["']$/g, "");
    }

    return result;
}

/**
 * Parses the properties of a wiki page.
 *
 * @param source Raw Markdown content to parse.
 * @returns Parsed page properties, excluding the `slug` property.
 */
export default function parseProperties(source: string): Omit<WikiProperties, "slug"> {
    const metadata = parseFields(
        extractBlock(source, "METADATA")
    ) as PageMetadata;

    const heroFields = parseFields(
        extractBlock(source, "HERO")
    );

    const infoboxSource = extractBlock(source, "INFOBOX");

    const infoboxes = [
        ...infoboxSource.matchAll(
            /---\s*(.*?)\s*\n([\s\S]*?)(?=---|$)/g
        )
    ].map(([, title, fields]) => ({
        title: title.trim(),
        fields: Object.fromEntries(
            Object.entries(parseFields(fields)).map(
                ([key, value]) => [key, String(value)]
            )
        )
    }));

    return {
        ...(Object.keys(metadata).length > 0 && {
            metadata: metadata as WikiProperties["metadata"]
        }),
        ...(Object.keys(heroFields).length > 0 && {
            hero: heroFields as unknown as WikiProperties["hero"]
        }),
        ...(infoboxes.length > 0 && { infoboxes })
    };
}
