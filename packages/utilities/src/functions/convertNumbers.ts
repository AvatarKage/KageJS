import { numberScaleArray } from "../data/numbers.js";

const numberWordsMap: Record<string, number> = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
    twenty: 20,
    thirty: 30,
    forty: 40,
    fifty: 50,
    sixty: 60,
    seventy: 70,
    eighty: 80,
    ninety: 90,
};

const numberValuesMap: Record<number, string> = Object.fromEntries(
    Object.entries(numberWordsMap).map(([word, value]) => [value, word])
);

const scaleWords = numberScaleArray.map(word => word.toLowerCase());

const numberScalesMap: Record<string, bigint> = Object.fromEntries(
    scaleWords.map((word, index) => [word, 1000n ** BigInt(index + 1)])
);

const smallNumberWords = Object.keys(numberWordsMap);

const escapeRegex = (value: string): string =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const numberWordPattern = [
    ...smallNumberWords,
    ...scaleWords,
    "hundred",
    "and",
    "minus",
    "negative",
]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegex)
    .join("|");

const numberWordsRegex = new RegExp(
    `\\b(?:${numberWordPattern})(?:[\\s-]+(?:${numberWordPattern}))*\\b`,
    "gi"
);

function underThousandToWords(value: number): string {
    if (value < 20) {
        return numberValuesMap[value];
    }

    if (value < 100) {
        const tens = Math.floor(value / 10) * 10;
        const remainder = value % 10;

        return remainder
            ? `${numberValuesMap[tens]}-${numberValuesMap[remainder]}`
            : numberValuesMap[tens];
    }

    const hundreds = Math.floor(value / 100);
    const remainder = value % 100;

    return remainder
        ? `${numberValuesMap[hundreds]} hundred ${underThousandToWords(remainder)}`
        : `${numberValuesMap[hundreds]} hundred`;
}

function numberToWords(value: bigint): string {
    if (value === 0n) return "zero";
    if (value < 0n) return `minus ${numberToWords(-value)}`;

    const groups: string[] = [];
    let scaleIndex = 0;

    while (value > 0n) {
        const group = Number(value % 1000n);

        if (group !== 0) {
            const words = underThousandToWords(group);
            const scale = scaleIndex > 0
                ? ` ${scaleWords[scaleIndex - 1]}`
                : "";

            groups.unshift(`${words}${scale}`);
        }

        value /= 1000n;
        scaleIndex++;
    }

    return groups.join(" ");
}

function wordsToNumber(input: string): bigint {
    const words = input
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/\b(?:and)\b/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    let total = 0n;
    let current = 0n;
    let negative = false;

    for (const word of words) {
        if (word === "minus" || word === "negative") {
            negative = true;
            continue;
        }

        if (word === "hundred") {
            current = (current || 1n) * 100n;
        } else if (word in numberScalesMap) {
            total += (current || 1n) * numberScalesMap[word];
            current = 0n;
        } else if (word in numberWordsMap) {
            current += BigInt(numberWordsMap[word]);
        }
    }

    const result = total + current;
    return negative ? -result : result;
}

function convertText(
    text: string,
    direction: "toWords" | "toNumbers"
): string {
    if (direction === "toWords") {
        return text.replace(
            /(?<![\w.])-?\d[\d,]*(?![\w.])/g,
            match => numberToWords(BigInt(match.replace(/,/g, "")))
        );
    }

    return text.replace(numberWordsRegex, match => {
        const normalized = match
            .toLowerCase()
            .replace(/-/g, " ")
            .trim();

        const tokens = normalized.split(/\s+/);

        const isNumberPhrase = tokens.every(
            word =>
                word === "and" ||
                word === "hundred" ||
                word === "minus" ||
                word === "negative" ||
                word in numberWordsMap ||
                word in numberScalesMap
        );

        if (!isNumberPhrase) {
            return match;
        }

        return wordsToNumber(match).toLocaleString("en-US");
    });
}

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
export default function convertNumbers(text: string) {
    return {
        /**
         * Converts numeric digits into words.
         * Commas in the input are accepted.
         *
         * @returns Text with numeric values written as words.
         */
        toWords: (): string => convertText(text, "toWords"),

        /**
         * Converts written numbers into digits with thousands separators.
         *
         * @returns Text with number phrases converted to comma-formatted digits.
         */
        toNumbers: (): string => convertText(text, "toNumbers"),
    };
}
