export {};
declare global {
    interface Array<T> {
        /** Returns a random element, or `undefined` if empty.
         * @example [1, 2, 3].random() // 2
         */
        random(): T | undefined;
        /** Returns `count` random elements without repeating indices.
         * @example [1, 2, 3].random(2) // [3, 1]
         */
        random(count: number): T[];
        /** Returns a shuffled copy without modifying the original.
         * @example [1, 2, 3].shuffle() // [2, 3, 1]
         */
        shuffle(): T[];
    }
}
