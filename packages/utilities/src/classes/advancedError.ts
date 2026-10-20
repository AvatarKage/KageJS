type Props = {
    message?: string;
    details?: unknown;
};

const DefaultErrorMessages: Record<number, string> = {
    // Informational Responses
    100: "Continue",
    101: "Switching Protocols",
    102: "Processing",
    103: "Early Hints",

    // Successful Responses
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non-Authoritative Information",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    207: "Multi-Status",
    208: "Already Reported",
    226: "IM Used",

    // Redirection Responses
    300: "Multiple Choices",
    301: "Moved Permanently",
    302: "Found",
    303: "See Other",
    304: "Not Modified",
    305: "Use Proxy",
    307: "Temporary Redirect",
    308: "Permanent Redirect",

    // Client Error Responses
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Payload Too Large",
    414: "URI Too Long",
    415: "Unsupported Media Type",
    416: "Range Not Satisfiable",
    417: "Expectation Failed",
    418: "I'm a Teapot",
    421: "Misdirected Request",
    422: "Unprocessable Entity",
    423: "Locked",
    424: "Failed Dependency",
    425: "Too Early",
    426: "Upgrade Required",
    428: "Precondition Required",
    429: "Too Many Requests",
    431: "Request Header Fields Too Large",
    451: "Unavailable For Legal Reasons",

    // Server Error Responses
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates",
    507: "Insufficient Storage",
    508: "Loop Detected",
    509: "Bandwidth Limit Exceeded",
    510: "Not Extended",
    511: "Network Authentication Required",

    // Application Errors
    1000: "Assertion Failed",
    1052: "Shadow Detected",

    // Database Errors
    2000: "Database Error",
    2001: "Database Connection Failed",
    2002: "Database Connection Timeout",
    2003: "Database Query Failed",
    2004: "Database Transaction Failed",
    2005: "Database Locked",
    2006: "Database Out of Memory",
    2007: "Database Is Read-Only",
    2008: "Database Operation Interrupted",
    2009: "Database I/O Error",
    2010: "Database Corruption Detected",
    2011: "Database Storage Full",
    2012: "Unable to Open Database",
    2013: "Database Lock Error",
    2014: "Database Schema Changed",
    2015: "Database Value Too Large",
    2016: "Database Constraint Violation",
    2017: "Database Type Mismatch",
    2018: "Database API Misuse",
    2019: "Database Authorization Denied",
    2020: "Database Parameter Out of Range",
    2021: "Invalid Database Format",
    2022: "Database Warning",
    2023: "Database Closed",
    2024: "Database Schema Error",
    2025: "Database Record Not Found",
    2026: "Database Migration Failed",
    2027: "Database Unique Constraint Violation",
    2028: "Database Foreign Key Constraint Violation",
    2029: "Database NOT NULL Constraint Violation",
    2030: "Database CHECK Constraint Violation"
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
    public readonly id: string;
    public readonly code: number;
    public readonly details?: unknown;

    constructor(code: number, { message, details }: Props = {}) {
        super(
            message ??
            DefaultErrorMessages[code] ??
            "Unknown Error"
        );

        this.id = crypto.randomUUID();
        this.name = this.constructor.name;
        this.code = code;
        this.details = details;

        Object.setPrototypeOf(this, new.target.prototype);

        Error.captureStackTrace?.(this, this.constructor);
    }

    toJSON() {
        return {
            id: this.id,
            code: this.code,
            message: this.message,
            details: this.details,
            stack: this.stack,
        };
    }

    [Symbol.for("nodejs.util.inspect.custom")]() {
        return this.toJSON();
    }
}
