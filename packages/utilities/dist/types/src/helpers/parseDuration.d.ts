import { Duration } from "../types/duration.type.js";
/**
 * Converts a duration string into milliseconds.
 *
 * Supported formats:
 * - s = seconds
 * - m = minutes
 * - h = hours
 * - d = days
 *
 * @example
 * - "30s" -> 30000
 * - "15m" -> 900000
 * - "2h"  -> 7200000
 * - "7d"  -> 604800000
 */
export default function parseDuration(input: Duration): number;
