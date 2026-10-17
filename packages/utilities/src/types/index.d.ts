export function cleanJSON<T>(data: T): T;

declare global {
    interface JSON {
        /**
         * Recursively cleans an object by removing:
         * - `null`
         * - `undefined`
         * - empty strings (`""`)
         * - empty arrays (`[]`)
         * - empty objects (`{}`)
         * 
         * @returns {any} A cleaned version of the object, or `undefined` if empty
         * 
         * @example
         * const data = {
         *   name: "John",
         *   age: null,
         *   tags: ["dev", "", null],
         *   meta: {
         *     empty: {},
         *     valid: "yes"
         *   }
         * };
         * 
         * const cleaned = cleanJSON(data);
         * console.log(cleaned);
         * // Output:
         * // {
         * //   name: "John",
         * //   tags: ["dev"],
         * //   meta: { valid: "yes" }
         * // }
         */
        clean<T>(data: T): T;
    }
}
