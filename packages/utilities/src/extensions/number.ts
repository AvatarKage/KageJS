export {};

/**
 * Formats a number into multiple readable representations.
 *
 * Produces:
 * - Full string with commas
 * - Short format with suffixes (K, M, B, T, etc.)
 * - Long format with full scale names (Thousand, Million, etc.)
 *
 * Supports values up to Decillion.
 *
 * @param {number} number - The number to format
 * @returns {{
 *   string: string,
 *   short: string,
 *   long: string
 * }}
 *
 * @example
 * formatNumber(1234567);
 * // {
 * //   string: "1,234,567",
 * //   short: "1.2M",
 * //   long: "1.2 Million"
 * // }
 */
Object.defineProperty(Number.prototype, "toFormat", {
    value: function (this: number): {
        string: string;
        short: string;
        long: string;
    } {
        if (!Number.isFinite(this)) {
            throw new Error("A valid number must be provided");
        }

        const suffixes = [
            "K", "M", "B", "T",
            "Qa", "Qi", "Sx", "Sp", "Oc", "No",
            "Dc", "Ud", "Dd", "Td", "Qad", "Qid",
            "Sxd", "Spd", "Ocd", "Nod",
            "Vg", "Uvg", "Dvg", "Tvg", "Qavg", "Qivg",
            "Sxvg", "Spvg", "Ocvg", "Novg",
            "Tg"
        ];

        const suffixesLong = [
            "Thousand", "Million", "Billion", "Trillion",
            "Quadrillion", "Quintillion", "Sextillion", "Septillion",
            "Octillion", "Nonillion", "Decillion",
            "Undecillion", "Duodecillion", "Tredecillion",
            "Quattuordecillion", "Quindecillion", "Sexdecillion",
            "Septendecillion", "Octodecillion", "Novemdecillion",
            "Vigintillion", "Unvigintillion", "Duovigintillion",
            "Tresvigintillion", "Quattuorvigintillion",
            "Quinvigintillion", "Sexvigintillion", "Septemvigintillion",
            "Octovigintillion", "Novemvigintillion",
            "Trigintillion"
        ];

        let num = Number.prototype.valueOf.call(this);
        let magnitude = 0;

        while (Math.abs(num) >= 1000 && magnitude < suffixes.length) {
            num /= 1000;
            magnitude++;
        }

        const formattedFull = Math.round(this).toLocaleString("en-US");
        const formattedShortNumber =
            num % 1 === 0 ? num.toFixed(0) : num.toFixed(1);

        return {
            string: formattedFull,
            short: magnitude === 0
                ? formattedShortNumber
                : formattedShortNumber + suffixes[magnitude - 1],
            long: magnitude === 0
                ? formattedShortNumber
                : formattedShortNumber + " " + suffixesLong[magnitude - 1]
        };
    },
    writable: true,
    configurable: true,
    enumerable: false
});
