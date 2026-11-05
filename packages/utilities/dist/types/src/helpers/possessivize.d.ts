/**
 * Converts a name into its possessive form.
 *
 * Appends an apostrophe if the text already ends in "s",
 * otherwise appends an apostrophe followed by "s".
 *
 * @param text - The name to convert.
 * @returns The possessive form of the supplied text.
 *
 * @example
 * possessivize("John");  // "John's"
 * possessivize("James"); // "James'"
 */
export default function possessivize(text: string): string;
