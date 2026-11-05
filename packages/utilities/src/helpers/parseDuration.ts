import { Duration } from "../../types/duration.type.js";

/**
 * Converts a duration string into milliseconds.
 *
 * Supported units:
 * - s = seconds
 * - m = minutes
 * - h = hours
 * - d = days
 *
 * Supports integer and decimal values.
 *
 * @param input - Duration string to parse.
 * @returns Duration converted into milliseconds.
 * @throws Error if the duration format or value is invalid.
 *
 * @example
 * parseDuration("30s"); // 30000
 * parseDuration("15m"); // 900000
 * parseDuration("2h"); // 7200000
 * parseDuration("7d"); // 604800000
 * parseDuration("1.5h"); // 5400000
 */
export default function parseDuration(input: Duration): number {
    const match = input.match(/^(\d+(?:\.\d+)?)(d|h|m|s)$/i);

    if (!match) {
        throw new Error(`Invalid duration format: ${input}`);
    }

    const value = Number(match[1]);
    const unit = match[2].toLowerCase();

    const multipliers: Record<string, number> = {
        s: 1000,
        m: 1000 * 60,
        h: 1000 * 60 * 60,
        d: 1000 * 60 * 60 * 24
    };

    return value * multipliers[unit];
}
