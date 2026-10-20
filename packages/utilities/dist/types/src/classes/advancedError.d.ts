type Props = {
    message?: string;
    details?: unknown;
};
/**
 * AdvancedError extends the native Error object and adds
 * structured metadata for API-driven applications.
 *
 * It supports:
 * - numeric error codes
 * - optional custom or default messages (fallbacks based on code)
 * - optional context details for logging and debugging
 *
 * If no message is provided, a default message is resolved from the error code
 * (e.g., 500 -> "Internal Server Error").
 *
 * @example
 * try {
 *     throw new AdvancedError(500, {
 *         message: "An error occurred while fetching account",
 *         details: {
 *             query: "SELECT * FROM accounts",
 *             userId: "123"
 *         }
 *     });
 * } catch (error) {
 *     if (error instanceof AdvancedError) {
 *         log.error("Id:", error.id);
 *         log.error("Code:", error.code);
 *         log.error("Message:", error.message);
 *         log.error("Details:", error.details);
 *     } else {
 *         log.error("Unknown error:", error);
 *     }
 * }
 */
export default class AdvancedError extends Error {
    readonly id: string;
    readonly code: number;
    readonly details?: unknown;
    constructor(code: number, { message, details }?: Props);
    toJSON(): {
        id: string;
        code: number;
        message: string;
        details: unknown;
        stack: string | undefined;
    };
}
export {};
