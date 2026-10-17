/**
 * Pads a number with leading zeros to a fixed length.
 *
 * @param length - The total length of the resulting string.
 * @returns The padded number as a string.
 *
 * @example
 * (4).pad(5); // "00004"
 */
Object.defineProperty(Number.prototype, "pad", {
    value: function (length: number) {
        return this.toString().padStart(length, "0");
    },
    writable: true,
    configurable: true,
    enumerable: false
});

export {};
