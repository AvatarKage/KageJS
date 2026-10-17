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
    }
}

export {};
