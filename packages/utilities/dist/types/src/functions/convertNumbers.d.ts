/**
 * Converts numbers between digits and words inside text.
 *
 * Supports extremely large numbers beyond standard uses.
 * Hyphenates compound tens and formats numeric output with commas.
 *
 * @param text - Text containing digits or written numbers.
 * @returns Methods for converting digits to words or number words to digits.
 *
 * @example
 * convertNumbers("I have 1 apple and 50000 pies").toWords();
 * // "I have one apple and fifty thousand pies"
 *
 * @example
 * convertNumbers("I have fifty thousand pies").toNumbers();
 * // "I have 50,000 pies"
 *
 * @example
 * convertNumbers("The answer is 1234567").toWords();
 * // "The answer is one million two hundred thirty-four thousand five hundred sixty-seven"
 */
export default function convertNumbers(text: string): {
    /**
     * Converts numeric digits into words.
     * Commas in the input are accepted.
     *
     * @returns Text with numeric values written as words.
     */
    toWords: () => string;
    /**
     * Converts written numbers into digits with thousands separators.
     *
     * @returns Text with number phrases converted to comma-formatted digits.
     */
    toNumbers: () => string;
};
