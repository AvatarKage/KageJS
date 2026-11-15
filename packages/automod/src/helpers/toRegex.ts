/**
 * Converts a wildcard pattern or existing regular expression into a RegExp.
 *
 * Supports wildcard matching using `*`, where wildcards match zero or more
 * non-whitespace characters. Literal regex-special characters are escaped
 * automatically.
 *
 * When a RegExp is provided, it is returned unchanged.
 *
 * Matching is case-insensitive and Unicode-aware.
 *
 * Optionally supports whitespace between consecutive pattern characters
 * using the `allowSpacesBetweenLetters` parameter. When enabled, zero or
 * more whitespace characters are allowed between each character.
 *
 * Boundary matching:
 * - Patterns without a leading wildcard require a valid left boundary.
 * - Patterns without a trailing wildcard require a valid right boundary.
 * - Word boundaries exclude Unicode letters, numbers, underscores, and hyphens.
 *
 * Consecutive wildcards are handled specially to preserve literal asterisks
 * in certain interior wildcard positions.
 *
 * @param input - A string wildcard pattern or an existing RegExp instance.
 * @param allowSpacesBetweenLetters - Whether to allow optional whitespace
 * between consecutive pattern characters. Defaults to `false`.
 *
 * @returns A RegExp matching the specified pattern. Existing RegExp inputs
 * are returned unchanged; string inputs are converted using Unicode-aware,
 * case-insensitive matching.
 *
 * @example
 * // Matches "hello".
 * toRegex("hello");
 *
 * @example
 * // Matches any non-whitespace sequence before "world".
 * toRegex("*world");
 *
 * @example
 * // Matches "hello" followed by any non-whitespace characters.
 * toRegex("hello*");
 *
 * @example
 * // Allows optional whitespace between pattern characters.
 * toRegex("bitch", true).test("b i t c h"); // true
 *
 * @example
 * // Whitespace between pattern characters is disabled by default.
 * toRegex("bitch").test("b i t c h"); // false
 *
 * @example
 * // Existing regular expressions are returned unchanged.
 * const pattern = /hello/i;
 * toRegex(pattern) === pattern; // true
 *
 * @example
 * // Regex-special characters are treated literally.
 * toRegex("file.txt");
 *
 * @remarks
 * Generated regular expressions use the `iu` flags:
 * - `i`: Case-insensitive matching.
 * - `u`: Unicode-aware matching.
 *
 * Uses negative lookbehind and negative lookahead for boundary checks.
 *
 * @throws {SyntaxError} If the generated regular expression is invalid
 * or the runtime does not support the required regular expression features.
 */
export default function toRegex(
    input: string | RegExp,
    allowSpacesBetweenLetters = false
): RegExp {
    if (input instanceof RegExp) {
        return input;
    }

    const startsWithWildcard = input.startsWith("*");
    const endsWithWildcard = input.endsWith("*");

    const parts = input.split("*");
    let escaped = "";

    for (let i = 0; i < parts.length; i++) {
        const chars = [...parts[i]];

        escaped += chars
            .map(char => char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .join(allowSpacesBetweenLetters ? "\\s*" : "");

        if (i < parts.length - 1) {
            const isLeading = i === 0 && startsWithWildcard;
            const isTrailing = i === parts.length - 2 && endsWithWildcard;

            const isConsecutive = parts[i] === "" && parts[i + 1] === "";

            if (isConsecutive && !isLeading && !isTrailing) {
                escaped += "\\*";
            } else {
                escaped += "[^\\s]*";
            }
        }
    }

    const prefix = startsWithWildcard && !input.startsWith("**")
        ? "[^\\s]*"
        : "(?<![\\p{L}\\p{N}_-])";

    const suffix = endsWithWildcard
        ? "[^\\s]*"
        : "(?![\\p{L}\\p{N}_-])";

    return new RegExp(`${prefix}${escaped}${suffix}`, "iu");
}
