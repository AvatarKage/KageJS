export type Severity = "default" | "info" | "success" | "warn" | "error" | "debug";
/**
 * Configuration options for the Logger instance.
 *
 * @example
 * const logger = new Logger({
 *     path: "./logs",
 *     nerdFonts: true,
 *     debugMode: true,
 * });
 */
export type LoggerOptions = {
    /**
     * Directory where log files are stored.
     *
     * Logs are organized into scope-specific subdirectories.
     *
     * @default "logs"
     *
     * @example
     * path: "./storage/logs"
     */
    path?: string;
    /**
     * Enables Nerd Font icons in console output.
     *
     * Requires a terminal font that supports Nerd Fonts.
     *
     * @default false
     */
    nerdFonts?: boolean;
    /**
     * Enables logging for all severity levels.
     *
     * When disabled, only error-level logs are emitted.
     *
     * @default true
     */
    debugMode?: boolean;
};
/**
 * Function used to output log messages.
 *
 * Accepts any number of arguments, including strings,
 * numbers, objects, arrays, and errors.
 *
 * @param args - Values to log.
 *
 * @example
 * logger("Application started");
 *
 * @example
 * logger("User:", { id: 123, name: "John" });
 */
export type LogFunction = (...args: unknown[]) => void;
/**
 * A logging method supporting normal, temporary, and silent output.
 *
 * @example
 * logger.info("Application started");
 *
 * @example
 * logger.info.temp("Temporary message");
 *
 * @example
 * logger.info.silent("Saved without console output");
 */
export type LogMethod = LogFunction & {
    /**
     * Outputs a temporary console message without saving it to disk.
     *
     * @param args - Values to log.
     *
     * @example
     * logger.info.temp("Connecting...");
     */
    temp: LogFunction;
    /**
     * Saves a message to disk without displaying it in the console.
     *
     * @param args - Values to log.
     *
     * @example
     * logger.info.silent("Background task completed");
     */
    silent: LogFunction;
};
export type LogScope = LogMethod & {
    info: LogMethod;
    success: LogMethod;
    warn: LogMethod;
    error: LogMethod;
    debug: LogMethod;
};
export declare const scopes: {
    readonly process: "";
    readonly memory: "";
    readonly cpu: "";
    readonly disk: "󰋊";
    readonly fs: "󱥾";
    readonly upload: "󰕒";
    readonly download: "󰇚";
    readonly app: "";
    readonly server: "󰒋";
    readonly client: "";
    readonly config: "󰒓";
    readonly db: "󰆼";
    readonly cache: "";
    readonly worker: "󰆍";
    readonly cron: "󰓦";
    readonly element: "";
    readonly proxy: "";
    readonly network: "󰖩";
    readonly ws: "󰚥";
    readonly auth: "󰌆";
    readonly watchdog: "󰩄";
    readonly test: "";
    readonly time: "";
    readonly i18n: "󰗊";
    readonly command: "";
    readonly level: "";
    readonly ai: "󰚩";
    readonly music: "󰎇";
    readonly playback: "";
    readonly scan: "";
    readonly id: "";
    readonly snowflake: "";
    readonly search: "";
    readonly notif: "󱇥";
    readonly email: "󰪱";
    readonly msg: "󰍡";
    readonly mic: "󰍬";
    readonly webhook: "󰘯";
    readonly discord: "";
};
export type LoggerScopeName = keyof typeof scopes;
export type LoggerScopes = Record<LoggerScopeName, LogScope>;
/**
 * Logger instance providing scoped, severity-based logging.
 *
 * Supports console output, file persistence, temporary messages,
 * silent messages, and automatic log cleanup.
 *
 * @example
 * const logger = new Logger({
 *     path: "./logs",
 *     nerdFonts: true,
 * });
 *
 * logger("Hello world");
 * logger.info("Application initialized");
 * logger.server.success("Server started");
 * logger.db.error("Connection failed");
 */
export type LoggerInstance = LogScope & LoggerScopes & {
    info: LogMethod;
    success: LogMethod;
    warn: LogMethod;
    error: LogMethod;
    debug: LogMethod;
    temp: LogFunction;
    silent: LogFunction;
    flush(): Promise<void>;
    clearLogs(days?: number): Promise<void>;
};
export interface LoggerConstructor {
    new (options?: LoggerOptions): LoggerInstance;
}
declare const LoggerExport: LoggerConstructor;
export { LoggerExport as Logger };
export default LoggerExport;
