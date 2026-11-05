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
export default function parseDuration(input: Duration): number;
