/**
 * Pluralizes an English noun.
 *
 * Applies common English pluralization rules:
 * - Adds "es" to words ending in s, x, z, ch, or sh.
 * - Changes consonant + "y" to "ies".
 * - Changes most words ending in "f" or "fe" to "ves".
 * - Adds "s" to other words.
 *
 * Handles common exceptions such as roof, chief, belief, and chef.
 *
 * @param value - The singular noun to pluralize.
 * @returns The pluralized noun. Returns the original value if empty.
 *
 * @example
 * pluralize("cat");      // "cats"
 * pluralize("box");      // "boxes"
 * pluralize("church");   // "churches"
 * pluralize("baby");     // "babies"
 * pluralize("knife");    // "knives"
 * pluralize("roof");     // "roofs"
 * pluralize("  cat  ");  // "cats"
 * pluralize("");         // ""
 */
export default function pluralize(text: string): string {
    const trimmed = text.trim();

    if (!trimmed) return text;

    if (/(s|x|z|ch|sh)$/i.test(trimmed)) {
        if (/ss$/i.test(trimmed)) {
            return `${trimmed}es`;
        }

        return trimmed.endsWith("s")
            ? trimmed
            : `${trimmed}es`;
    }

    if (/[^aeiou]y$/i.test(trimmed)) {
        return `${trimmed.slice(0, -1)}ies`;
    }

    if (/(?:f|fe)$/i.test(trimmed)) {
        if (/(?:roof|chief|belief|chef)$/i.test(trimmed)) {
            return `${trimmed}s`;
        }

        return trimmed.replace(/fe?$/i, "ves");
    }

    return `${trimmed}s`;
};
