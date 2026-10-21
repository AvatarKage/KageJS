import { DateTime } from "luxon";
import chalk from "chalk";

import AdvancedError from "./advancedError.js";

export type Severity =
    | "default"
    | "info"
    | "success"
    | "warn"
    | "error"
    | "debug";

type Mode = "normal" | "temp" | "silent";

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

export const scopes = {
    process: "",
    memory: "",
    cpu: "",
    disk: "󰋊",
    fs: "󱥾",
    upload: "󰕒",
    download: "󰇚",
    app: "",
    server: "󰒋",
    client: "",
    config: "󰒓",
    db: "󰆼",
    cache: "",
    worker: "󰆍",
    cron: "󰓦",
    element: "",
    proxy: "",
    network: "󰖩",
    ws: "󰚥",
    auth: "󰌆",
    watchdog: "󰩄",
    test: "",
    time: "",
    i18n: "󰗊",
    command: "",
    level: "",
    ai: "󰚩",
    music: "󰎇",
    playback: "",
    scan: "",
    id: "",
    snowflake: "",
    search: "",
    notif: "󱇥",
    email: "󰪱",
    msg: "󰍡",
    mic: "󰍬",
    webhook: "󰘯",
    discord: "",
} as const;

export type LoggerScopeName = keyof typeof scopes;

export type LoggerScopes = Record<LoggerScopeName, LogScope>;

export type LoggerInstance = LogScope &
    LoggerScopes & {
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

class Logger {
    declare info: LogMethod;
    declare success: LogMethod;
    declare warn: LogMethod;
    declare error: LogMethod;
    declare debug: LogMethod;

    declare temp: LogFunction;
    declare silent: LogFunction;

    private fsNode: typeof import("node:fs/promises") | null = null;
    private pathNode: typeof import("node:path") | null = null;
    private inspectNode: typeof import("node:util").inspect | null = null;

    private readonly ready: Promise<void>;

    private readonly options: Required<
        Pick<LoggerOptions, "nerdFonts" | "debugMode">
    > &
        LoggerOptions;

    private readonly scopes = new Map<string, LogScope>();
    private readonly pendingWrites = new Set<Promise<void>>();

    private writeQueue: Promise<void> = Promise.resolve();

    private readonly severityIcons: Record<Severity, string> = {
        default: "󰋼",
        info: "",
        success: "",
        warn: "",
        error: "",
        debug: "",
    };

    constructor(options: LoggerOptions = {}) {
        this.options = {
            ...options,
            path: options.path ?? "logs",
            nerdFonts: options.nerdFonts ?? false,
            debugMode: options.debugMode ?? true,
        };

        this.ready = (async () => {
            if (typeof window !== "undefined") return;

            const [fs, path, util] = await Promise.all([
                import("node:fs/promises"),
                import("node:path"),
                import("node:util"),
            ]);

            this.fsNode = fs;
            this.pathNode = path;
            this.inspectNode = util.inspect;
        })();

        const root = this.makeScope("");

        return new Proxy(root as unknown as Logger, {
            get: (_target, key, receiver) => {
                if (typeof key !== "string") {
                    return Reflect.get(root, key, receiver);
                }

                if (key === "then") return undefined;

                if (key in this) {
                    const value = Reflect.get(this, key, this);

                    return typeof value === "function"
                        ? value.bind(this)
                        : value;
                }

                if (key in root) {
                    return Reflect.get(root, key, receiver);
                }

                return this.makeScope(key);
            },
        }) as Logger;
    }

    private makeMethod(
        scope: string,
        severity: Severity,
    ): LogMethod {
        const method = ((...args: unknown[]) => {
            this.emit(scope, severity, "normal", args);
        }) as LogMethod;

        method.temp = (...args: unknown[]) => {
            this.emit(scope, severity, "temp", args);
        };

        method.silent = (...args: unknown[]) => {
            this.emit(scope, severity, "silent", args);
        };

        return method;
    }

    private makeScope(scope: string): LogScope {
        const cached = this.scopes.get(scope);

        if (cached) return cached;

        const method = this.makeMethod(
            scope,
            "default",
        ) as LogScope;

        for (const severity of [
            "info",
            "success",
            "warn",
            "error",
            "debug",
        ] as const) {
            method[severity] = this.makeMethod(scope, severity);
        }

        this.scopes.set(scope, method);

        return method;
    }

    private formatArg(
        value: unknown,
        colors: boolean,
        seen = new WeakSet<object>(),
        depth = 0,
    ): string {
        if (typeof value === "string") return value;
        if (value === null) return "null";
        if (value === undefined) return "undefined";

        if (typeof value === "bigint") return `${value}n`;

        if (
            typeof value === "number" ||
            typeof value === "boolean"
        ) {
            return String(value);
        }

        if (typeof value === "symbol") return value.toString();

        if (typeof value === "function") {
            return `[Function ${value.name || "anonymous"}]`;
        }

        if (value instanceof DateTime) {
            return value.toISO() ?? "Invalid DateTime";
        }

        if (value instanceof Date) {
            return Number.isNaN(value.valueOf())
                ? "Invalid Date"
                : value.toISOString();
        }

        if (this.inspectNode) {
            const inspected =
                value instanceof AdvancedError
                    ? value.toJSON()
                    : value;

            return this.inspectNode(inspected, {
                colors,
                depth: 12,
                compact: false,
                breakLength: 100,
                maxArrayLength: 100,
                maxStringLength: Infinity,
                getters: false,
            });
        }

        if (depth >= 12) return '"[Max Depth]"';

        if (typeof value === "object") {
            if (seen.has(value)) return '"[Circular]"';

            seen.add(value);

            try {
                if (value instanceof AdvancedError) {
                    return this.formatArg(
                        value.toJSON(),
                        colors,
                        seen,
                        depth + 1,
                    );
                }

                if (value instanceof Error) {
                    return this.formatArg(
                        {
                            name: value.name,
                            message: value.message,
                            stack: value.stack,
                        },
                        colors,
                        seen,
                        depth + 1,
                    );
                }

                if (Array.isArray(value)) {
                    return `[\n${value
                        .map(
                            (item) =>
                                `${"  ".repeat(depth + 1)}${this.formatArg(
                                    item,
                                    colors,
                                    seen,
                                    depth + 1,
                                )}`,
                        )
                        .join(",\n")}\n${"  ".repeat(depth)}]`;
                }

                if (value instanceof Map) {
                    const entries = Array.from(value.entries()).map(
                        ([key, item]) =>
                            `${"  ".repeat(depth + 1)}${this.formatArg(
                                key,
                                colors,
                                seen,
                                depth + 1,
                            )} => ${this.formatArg(
                                item,
                                colors,
                                seen,
                                depth + 1,
                            )}`,
                    );

                    return entries.length
                        ? `Map {\n${entries.join(",\n")}\n${"  ".repeat(depth)}}`
                        : "Map {}";
                }

                if (value instanceof Set) {
                    const entries = Array.from(value.values()).map(
                        (item) =>
                            `${"  ".repeat(depth + 1)}${this.formatArg(
                                item,
                                colors,
                                seen,
                                depth + 1,
                            )}`,
                    );

                    return entries.length
                        ? `Set {\n${entries.join(",\n")}\n${"  ".repeat(depth)}}`
                        : "Set {}";
                }

                const entries = Object.entries(value).map(
                    ([key, item]) =>
                        `${"  ".repeat(depth + 1)}${JSON.stringify(key)}: ${this.formatArg(
                            item,
                            colors,
                            seen,
                            depth + 1,
                        )}`,
                );

                return entries.length
                    ? `{\n${entries.join(",\n")}\n${"  ".repeat(depth)}}`
                    : "{}";
            } finally {
                seen.delete(value);
            }
        }

        return String(value);
    }

    private iconFor(
        scope: string,
        severity: Severity,
        mode: Mode,
    ): string {
        if (mode === "temp") {
            return "";
        }

        return (
            scopes[scope as LoggerScopeName] ??
            this.severityIcons[severity]
        );
    }

    private emit(
        scope: string,
        severity: Severity,
        mode: Mode,
        args: unknown[],
    ): void {
        if (!this.options.debugMode && severity !== "error") {
            return;
        }

        const task = this.ready.then(async () => {
            const now = DateTime.now();
            const time = now.toFormat("HH:mm:ss");

            const label = [
                scope ? scope.toUpperCase() : "",
                severity === "default" ? "" : severity.toUpperCase(),
                mode === "normal" ? "" : mode.toUpperCase(),
            ]
                .filter(Boolean)
                .join(" ") || "LOG";

            const prefix = this.options.nerdFonts
                ? this.iconFor(scope, severity, mode)
                : `[${label}]`;

            const consoleMessage = args
                .map((arg) => this.formatArg(arg, true))
                .join(" ");

            const line = `${time} ${prefix} ${consoleMessage}`;

            if (mode !== "silent") {
                const output = this.colorFor(severity)(line);

                if (severity === "error") {
                    console.error(output);
                } else if (severity === "debug") {
                    console.debug(output);
                } else {
                    console.log(output);
                }
            }

            if (mode !== "temp") {
                const fileMessage = args
                    .map((arg) => this.formatArg(arg, false))
                    .join(" ");

                const fileLine = `${time} [${label}] ${fileMessage}`;

                const write = this.writeQueue.then(() =>
                    this.writeToFile(
                        scope,
                        now.toFormat("yyyy-MM-dd"),
                        fileLine,
                    ),
                );

                this.writeQueue = write.catch((error: unknown) => {
                    console.error(
                        chalk.red("[LOGGER ERROR] Failed to write log:"),
                        error,
                    );
                });

                this.pendingWrites.add(write);

                try {
                    await write;
                } finally {
                    this.pendingWrites.delete(write);
                }
            }
        });

        void task.catch((error: unknown) => {
            console.error(chalk.red("[LOGGER ERROR]"), error);
        });
    }

    private colorFor(
        severity: Severity,
    ): (text: string) => string {
        const colors: Record<Severity, (text: string) => string> = {
            default: chalk.white,
            info: chalk.green,
            success: chalk.green,
            warn: chalk.yellow,
            error: chalk.red,
            debug: chalk.cyan,
        };

        return colors[severity];
    }

    private async writeToFile(
        scope: string,
        date: string,
        content: string,
    ): Promise<void> {
        await this.ready;

        if (!this.fsNode || !this.pathNode) return;

        const root = this.pathNode.resolve(
            this.options.path ?? "logs",
        );

        const safeScope = scope.replace(/[^a-zA-Z0-9_-]/g, "_");

        const dir = safeScope
            ? this.pathNode.join(root, safeScope)
            : root;

        await this.fsNode.mkdir(dir, { recursive: true });

        await this.fsNode.appendFile(
            this.pathNode.join(dir, `${date}.log`),
            // eslint-disable-next-line no-control-regex
            content.replace(/\x1B\[[0-9;]*m/g, "") + "\n",
            "utf8",
        );
    }

    async flush(): Promise<void> {
        await this.ready;
        await this.writeQueue;
        await Promise.allSettled([...this.pendingWrites]);
    }

    /**
     * @description Deletes log files dated on or before the specified number of days ago.
     *
     * Log files must follow the `YYYY-MM-DD.log` naming convention.
     * Empty scope directories are automatically removed.
     *
     * @param days - Number of days before today to use as the inclusive deletion cutoff. Defaults to 30. Set to 0 to delete all dated log files, including today's.
     *
     * @returns A promise that resolves when cleanup is complete.
     *
     * @throws {RangeError} If days is negative or not finite.
     *
     * @example
     * // Delete logs from 30 days ago and earlier.
     * await logger.clearLogs();
     *
     * @example
     * // Delete yesterday's logs and all older logs.
     * await logger.clearLogs(1);
     *
     * @example
     * // Delete logs from 7 days ago and earlier.
     * await logger.clearLogs(7);
     *
     * @example
     * // Delete all dated log files, including today's.
     * await logger.clearLogs(0);
     */
    async clearLogs(days = 30): Promise<void> {
        if (!Number.isFinite(days) || days < 0) {
            throw new RangeError("days must be nonnegative");
        }

        await this.ready;
        await this.flush();

        if (!this.fsNode || !this.pathNode) return;

        const fs = this.fsNode;
        const path = this.pathNode;

        const root = path.resolve(this.options.path ?? "logs");

        const cutoff = DateTime.now()
            .minus({ days })
            .toFormat("yyyy-MM-dd");

        const walk = async (dir: string): Promise<void> => {
            let entries;

            try {
                entries = await fs.readdir(dir, {
                    withFileTypes: true,
                });
            } catch (error) {
                if (
                    (error as NodeJS.ErrnoException).code === "ENOENT"
                ) {
                    return;
                }

                throw error;
            }

            for (const entry of entries) {
                const full = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    await walk(full);
                    continue;
                }

                if (!entry.isFile()) continue;

                const match = /^(\d{4}-\d{2}-\d{2})\.log$/.exec(
                    entry.name,
                );

                if (!match) continue;

                const fileDate = match[1];

                if (fileDate <= cutoff) {
                    await fs.unlink(full);
                }
            }

            if (dir !== root) {
                const remaining = await fs.readdir(dir);

                if (remaining.length === 0) {
                    await fs.rmdir(dir);
                }
            }
        };

        await walk(root);
    }
}

/**
 * Creates a configurable logger instance.
 *
 * Supports scoped logging, severity levels, console output,
 * file persistence, temporary messages, and silent messages.
 *
 * @param options - Optional logger configuration.
 *
 * @example
 * export const log = new Logger({
 *     path: "./logs",
 *     nerdFonts: true,
 *     debugMode: true,
 * });
 *
 * log("Application initialized");
 * log.success("Server started");
 */
export const LoggerExport: {
    new (options?: LoggerOptions): LoggerInstance;
} = Logger as unknown as {
    new (options?: LoggerOptions): LoggerInstance;
};

export { LoggerExport as Logger };
export default LoggerExport;
