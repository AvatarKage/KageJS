/*
 * Normalizes Unicode characters, removes diacritics and special characters,
 * converts text to lowercase, and replaces whitespace with hyphens.
 *
 * @param text - The string to convert into a slug.
 * @returns A lowercase, hyphen-separated URL slug.
 *
 * @example
 * slugify("Hello World!"); // "hello-world"
 */
export default function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}
