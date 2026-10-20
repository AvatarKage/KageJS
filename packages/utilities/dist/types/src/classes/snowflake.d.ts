/**
 * Snowflake ID Generator
 *
 * Generates unique 64-bit IDs based on:
 * - Timestamp
 * - Machine ID
 * - Sequence number
 *
 * @example
 * const epoch = 1767225600000; // Custom epoch number or ISO string
 * const machineId = 0; // Machine identifier (0–1023)
 *
 * const snowflake = new Snowflake(epoch, machineId);
 *
 * const id = snowflake.gen();
 * console.log(id);
 *
 * const date = snowflake.decode(id);
 * console.log(date);
 */
export default class Snowflake {
    private epoch;
    private sequence;
    private lastTimestamp;
    private machineId;
    constructor(epoch?: number | string, machine?: number);
    /**
     * Gets the current timestamp in milliseconds as a bigint.
     *
     * @private
     * @returns {bigint}
     */
    private currentTime;
    /**
     * Decodes a Snowflake ID into its original timestamp.
     *
     * @param {string} id - The Snowflake ID
     * @returns {Date} The date extracted from the ID
     */
    decode(id: string): Date;
    /**
     * Generates a new unique Snowflake ID.
     *
     * @returns {string} A unique ID as a string
     */
    gen(): string;
}
