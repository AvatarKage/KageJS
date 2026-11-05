
import { DateTime } from "luxon";

import AdvancedError from "./advancedError.js";

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
    private readonly dateTime: DateTime;

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
    constructor(input?: string | number | Date | DateTime) {
        if (input === undefined || input === null) {
            this.dateTime = DateTime.now();
        } else if (DateTime.isDateTime(input)) {
            this.dateTime = input;
        } else if (input instanceof Date) {
            this.dateTime = DateTime.fromJSDate(input);
        } else if (typeof input === "number") {
            this.dateTime = DateTime.fromMillis(input);
        } else {
            const trimmed = input.trim();

            if (/^\d{4}$/.test(trimmed)) {
                this.dateTime = DateTime.fromISO(`${trimmed}-01-01`);
            } else if (/^\d{4}-(?:0[1-9]|1[0-2])$/.test(trimmed)) {
                this.dateTime = DateTime.fromISO(`${trimmed}-01`);
            } else {
                this.dateTime = DateTime.fromISO(input);
            }
        }

        if (!this.dateTime.isValid) {
            throw new AdvancedError(1001, {
                message: "Invalid Timestamp",
                details: {
                    input,
                    reason: this.dateTime.invalidReason,
                    explanation: this.dateTime.invalidExplanation
                }
            });
        }
    }

    /**
     * Gets the timestamp in milliseconds.
     */
    public get milliseconds(): number {
        return this.dateTime.toMillis();
    }

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
    public toRemaining(): string {
        const remainingMs = this.dateTime.toMillis() - DateTime.now().toMillis();

        if (remainingMs <= 0) return "";

        const totalSeconds = Math.floor(remainingMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) return `${hours}h ${minutes}m ${seconds}s left`;
        if (minutes > 0) return `${minutes}m ${seconds}s left`;

        return `${seconds}s left`;
    }

    /**
     * Formats the timestamp as a detailed relative time string.
     *
     * Supports past and future dates.
     *
     * @example
     * timestamp.toLongRelative(); // "2 years ago"
     * future.toLongRelative(); // "in 2 years"
     */
    public toLongRelative(): string {
        const now = DateTime.now();
        const isFuture = this.dateTime.toMillis() > now.toMillis();

        const reference = isFuture ? this.dateTime : now;
        const target = isFuture ? now : this.dateTime;

        const format = (value: number, unit: string): string => {
            const amount = Math.floor(Math.abs(value));
            const plural = amount !== 1 ? "s" : "";

            return isFuture
                ? `in ${amount} ${unit}${plural}`
                : `${amount} ${unit}${plural} ago`;
        };

        const years = Math.floor(reference.diff(target, "years").years);

        if (years > 0) return format(years, "year");

        const months = Math.floor(reference.diff(target, "months").months);

        if (months > 0) return format(months, "month");

        const days = Math.floor(reference.diff(target, "days").days);

        if (days > 0) return format(days, "day");

        const hours = Math.floor(reference.diff(target, "hours").hours);

        if (hours > 0) return format(hours, "hour");

        const minutes = Math.floor(reference.diff(target, "minutes").minutes);

        if (minutes > 0) return format(minutes, "minute");

        const seconds = Math.floor(reference.diff(target, "seconds").seconds);

        if (seconds > 0) return format(seconds, "second");

        return "0 seconds ago";
    }

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
    public toShortRelative(): string {
        const now = DateTime.now();
        const diffHours = Math.abs(now.diff(this.dateTime, "hours").hours);

        if (diffHours < 48) {
            return this.dateTime.toRelative() ?? "0 seconds ago";
        }

        return this.dateTime.toFormat("LLLL d, yyyy");
    }

    /**
     * Formats the timestamp as a full date.
     *
     * @example
     * timestamp.toFullDate(); // "January 1, 2026"
     */
    public toFullDate(): string {
        return this.dateTime.toFormat("LLLL d, yyyy");
    }

    /**
     * Checks whether this timestamp is in the past.
     */
    public isPast(): boolean {
        return this.dateTime.toMillis() < DateTime.now().toMillis();
    }

    /**
     * Checks whether this timestamp is in the future.
     */
    public isFuture(): boolean {
        return this.dateTime.toMillis() > DateTime.now().toMillis();
    }

    /**
     * Checks whether this timestamp falls on today's calendar day.
     */
    public isToday(): boolean {
        return this.dateTime.hasSame(DateTime.local(), "day");
    }

    /**
     * Checks whether this timestamp has the same month and day as today.
     */
    public isAnniversaryToday(): boolean {
        const now = DateTime.local();

        return this.dateTime.month === now.month &&
            this.dateTime.day === now.day;
    }
}
