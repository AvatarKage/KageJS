import { DateTime } from "luxon";
/**
 * Represents a date/time value with additional formatting,
 * countdown, relative-time, and date-checking utilities built on Luxon.
 *
 * Supports ISO strings, year-only strings, year-month strings,
 * Unix timestamps in milliseconds, native Date objects, and Luxon DateTime.
 *
 * Defaults to the current date and time when no input is provided.
 *
 * @example
 * const timestamp = new Timestamp("2026-01-01");
 *
 * // Get the Unix timestamp in milliseconds
 * timestamp.milliseconds;
 *
 * // Format a countdown
 * timestamp.toRemaining(); // "1h 1m 1s left"
 *
 * // Format relative dates
 * timestamp.toLongRelative(); // "3 days ago"
 * timestamp.toShortRelative(); // "46 hours ago" or "January 1, 2026"
 * timestamp.toFullDate(); // "January 1, 2026"
 *
 * // Check the date
 * timestamp.isPast();
 * timestamp.isFuture();
 * timestamp.isToday();
 * timestamp.isBirthdayToday();
 *
 * @example
 * // Supported constructor inputs
 * new Timestamp();
 * new Timestamp("2026");
 * new Timestamp("2026-01");
 * new Timestamp("2026-01-01");
 * new Timestamp(Date.now());
 * new Timestamp(new Date());
 * new Timestamp(DateTime.now());
 *
 * @throws AdvancedError If the supplied date is invalid.
 */
export default class Timestamp {
    private readonly dateTime;
    /**
     * Creates a Timestamp instance.
     *
     * Supports ISO strings, year-only strings, year-month strings,
     * Unix timestamps in milliseconds, native Date objects, and Luxon DateTime.
     *
     * @param input - Date value to wrap.
     *
     * @throws AdvancedError if the supplied date is invalid.
     *
     * @example
     * new Timestamp("2026-01-01");
     * new Timestamp("2026");
     * new Timestamp("2026-01");
     * new Timestamp(Date.now());
     * new Timestamp(new Date());
     * new Timestamp(DateTime.now());
     */
    constructor(input?: string | number | Date | DateTime);
    /**
     * Gets the timestamp in milliseconds.
     */
    get milliseconds(): number;
    /**
     * Formats a remaining duration into a human-readable countdown.
     *
     * Automatically adjusts the output based on the duration:
     * - Hours, minutes, and seconds when at least one hour remains.
     * - Minutes and seconds when at least one minute remains.
     * - Seconds when less than one minute remains.
     *
     * Returns an empty string if the timestamp has passed.
     *
     * @example
     * timestamp.toRemaining(); // "1h 1m 1s left"
     */
    toRemaining(): string;
    /**
     * Formats the timestamp as a detailed relative time string.
     *
     * Supports past and future dates.
     *
     * @example
     * timestamp.toLongRelative(); // "2 years ago"
     * future.toLongRelative(); // "in 2 years"
     */
    toLongRelative(): string;
    /**
     * Formats the timestamp as a short, human-readable date.
     *
     * Formatting behavior:
     * - Year-only input returns the year.
     * - Year-month input returns the full month and year.
     * - Dates within 48 hours use relative formatting.
     * - Older dates use the full month, day, and year.
     *
     * @example
     * timestamp.toShortRelative(); // "2 hours ago" then later "January 1, 2026"
     */
    toShortRelative(): string;
    /**
     * Formats the timestamp as a full date.
     *
     * @example
     * timestamp.toFullDate(); // "January 1, 2026"
     */
    toFullDate(): string;
    /**
     * Checks whether this timestamp is in the past.
     */
    isPast(): boolean;
    /**
     * Checks whether this timestamp is in the future.
     */
    isFuture(): boolean;
    /**
     * Checks whether this timestamp falls on today's calendar day.
     */
    isToday(): boolean;
    /**
     * Checks whether this timestamp has the same month and day as today.
     */
    isAnniversaryToday(): boolean;
}
