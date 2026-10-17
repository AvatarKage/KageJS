declare global {
    interface JSON {
        /**
         * Recursively cleans an object by removing:
         * - `null`
         * - `undefined`
         * - Empty strings (`""`)
         * - Empty arrays (`[]`)
         * - Empty objects (`{}`)
         *
         * Buffers are preserved, and circular references are skipped.
         *
         * @param input - The value to clean.
         * @returns The cleaned value, or `undefined` if empty.
         *
         * @example
         * JSON.clean({
         *     name: "John",
         *     age: null,
         *     tags: ["dev", "", null],
         *     meta: {
         *         empty: {},
         *         valid: "yes"
         *     }
         * });
         *
         * // {
         * //     name: "John",
         * //     tags: ["dev"],
         * //     meta: { valid: "yes" }
         * // }
         */
        clean(input: unknown): unknown;
    }

    interface Number {
        /**
         * Pads a number with leading zeros to a fixed length.
         *
         * @param length - The total length of the resulting string.
         * @returns The padded number as a string.
         *
         * @example
         * (4).pad(5); // "00004"
         */
        pad(length: number): string;

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
        toFormat(): {
            string: string;
            short: string;
            long: string;
        };
    }
}

export {};
