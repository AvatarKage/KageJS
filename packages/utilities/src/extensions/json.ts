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
Object.defineProperty(JSON, "clean", {
    value: function cleanJSON(input: unknown): unknown {
        const seen = new WeakSet<object>();

        const isEmptyObject = (value: unknown): boolean =>
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value) &&
            Object.keys(value).length === 0;

        const clean = (value: unknown): unknown => {
            if (
                typeof Buffer !== "undefined" &&
                Buffer.isBuffer(value)
            ) {
                return value;
            }

            if (value === null || value === undefined) {
                return undefined;
            }

            if (typeof value !== "object") {
                return value;
            }

            if (seen.has(value)) {
                return undefined;
            }

            seen.add(value);

            if (Array.isArray(value)) {
                const result = value
                    .map(clean)
                    .filter(
                        (item) =>
                            item !== undefined &&
                            item !== null &&
                            item !== "" &&
                            !(Array.isArray(item) && item.length === 0) &&
                            !isEmptyObject(item)
                    );

                return result.length > 0 ? result : undefined;
            }

            const result = Object.fromEntries(
                Object.entries(value as Record<string, unknown>)
                    .map(([key, item]) => [key, clean(item)])
                    .filter(
                        ([, item]) =>
                            item !== undefined &&
                            item !== null &&
                            item !== "" &&
                            !(Array.isArray(item) && item.length === 0) &&
                            !isEmptyObject(item)
                    )
            );

            return Object.keys(result).length > 0
                ? result
                : undefined;
        };

        return clean(input);
    },
    writable: true,
    configurable: true,
    enumerable: false
});

export {};
