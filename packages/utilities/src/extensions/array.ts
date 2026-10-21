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

Object.defineProperty(Array.prototype, "shuffle", {
    value: function <T>(this: T[]): T[] {
        const a = [...this];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },
    writable: true,
    configurable: true,
});

Object.defineProperty(Array.prototype, "random", {
    value: function <T>(this: T[], count?: number): T | T[] | undefined {
        if (count === undefined) {
            return this.length
                ? this[Math.floor(Math.random() * this.length)]
                : undefined;
        }
        return this.shuffle().slice(0, Math.max(0, Math.floor(count)));
    },
    writable: true,
    configurable: true,
});
