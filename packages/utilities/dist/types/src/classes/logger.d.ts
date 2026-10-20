export type Severity = "default" | "info" | "success" | "warn" | "error" | "debug";
export type LoggerOptions = {
    path?: string;
    nerdFonts?: boolean;
    debugMode?: boolean;
};
export type LogFunction = (...args: unknown[]) => void;
export type LogMethod = LogFunction & {
    temp: LogFunction;
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
