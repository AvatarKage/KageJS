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
export default function pluralize(text: string): string;
