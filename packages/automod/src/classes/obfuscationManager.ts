import type { ObfuscationConfig } from "../../types/obfuscation.type.js";

/**
 * Manages character-level obfuscation mappings and generates normalized
 * message variants by replacing configured characters with their
 * corresponding alternative representations.
 *
 * Supports multiple replacement values per character, duplicate
 * elimination, and configurable variant generation limits.
 *
 * @remarks
 * The mapping is constructed from an {@link ObfuscationConfig} object.
 *
 * Each configuration entry defines a replacement character and the
 * characters that can be represented by that replacement.
 *
 * Special behavior:
 * - `_` represents an empty string (character removal).
 * - Original characters are always retained as possible alternatives.
 * - Duplicate replacements are removed.
 * - Variant generation stops when the configured limit is reached.
 */
export default class ObfuscationManager {
    /**
     * Stores character-to-replacement mappings.
     *
     * Each key represents an original character, while its associated
     * array contains the possible replacement strings.
     *
     * Empty strings are permitted as replacements to support
     * character removal.
     *
     * @type {Map<string, string[]>}
     *
     * @example
     * // Conceptual mapping:
     * // "a" -> ["@", "4"]
     * // "e" -> ["3"]
     */
    map: Map<string, string[]>;

    /**
     * Creates an ObfuscationManager and initializes its character
     * replacement mappings.
     *
     * Iterates through the supplied obfuscation configuration and
     * associates each configured character with its replacement values.
     *
     * Duplicate replacement values are ignored.
     *
     * @param obfuscations - Configuration describing replacement
     * characters and the original characters they represent.
     * Defaults to an empty configuration.
     *
     * @example
     * const manager = new ObfuscationManager({
     *     "@": ["a"],
     *     "3": ["e"]
     * });
     *
     * @example
     * // Underscore represents character removal.
     * const manager = new ObfuscationManager({
     *     "_": [" "]
     * });
     */
    constructor(obfuscations: ObfuscationConfig = {}) {
        this.map = new Map();

        for (const [key, values] of Object.entries(obfuscations)) {
            for (const char of values) {
                const replacements = this.map.get(char) ?? [];
                const replacement = key === "_" ? "" : key;

                if (!replacements.includes(replacement)) {
                    replacements.push(replacement);
                }

                this.map.set(char, replacements);
            }
        }
    }

    /**
     * Generates normalized variants of a message using the configured
     * character replacement mappings.
     *
     * For each character in the input message, uses its configured
     * replacement options to generate normalized variants.
     *
     * Characters with exactly one configured replacement are replaced
     * automatically. Characters with multiple configured replacements
     * generate separate variants for each replacement.
     *
     * Characters without configured replacements remain unchanged.
     *
     * Duplicate variants are removed after each iteration.
     *
     * @param message - The input message to normalize.
     *
     * @param limit - Maximum number of variants to generate.
     * Defaults to `128`.
     *
     * @returns An array of unique normalized message variants.
     *
     * @remarks
     * - Original characters are not included when replacements are configured.
     * - Characters with a single replacement are normalized automatically.
     * - Characters with multiple replacements generate separate variants.
     * - Replacement options are combined with existing variants.
     * - Empty replacements effectively remove the corresponding character.
     * - Generation stops once the intermediate variant count reaches
     *   the specified limit.
     * - The returned array may contain fewer variants than the limit
     *   because duplicate variants are removed.
     *
     * @example
     * const manager = new ObfuscationManager({
     *     "a": ["@"],
     *     "e": ["3"]
     * });
     *
     * manager.normalize("c@t");
     * // ["cat"]
     *
     * @example
     * // Ambiguous characters generate separate variants.
     * const manager = new ObfuscationManager({
     *     "a": ["!"],
     *     "i": ["!"]
     * });
     *
     * manager.normalize("s!te");
     * // ["sate", "site"]
     *
     * @example
     * // Limit the number of generated variants.
     * manager.normalize("message", 32);
     *
     * @example
     * // Use an empty replacement to support character removal.
     * const manager = new ObfuscationManager({
     *     "_": [" "]
     * });
     *
     * manager.normalize("hello world");
     * // ["helloworld"]
     */
    normalize(
        message: string,
        limit = 128
    ): string[] {
        let variants = [""];

        for (const char of Array.from(message)) {
            const mappings = this.map.get(char);

            if (!mappings?.length) {
                variants = variants.map(variant => variant + char);
                continue;
            }

            const unique = [...new Set(mappings)];

            const replacements = unique.length === 1
                ? unique
                : unique;

            const next: string[] = [];

            for (const variant of variants) {
                for (const replacement of replacements) {
                    next.push(variant + replacement);

                    if (next.length >= limit) {
                        break;
                    }
                }

                if (next.length >= limit) {
                    break;
                }
            }

            variants = next;
        }

        return [...new Set(variants)].slice(0, limit);
    }
}
