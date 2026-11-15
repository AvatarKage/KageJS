import type { AutoModConfig } from "./automod.type.js";
import type { Metadata, Severity } from "./common.type.js";

export interface FilterConfig extends Omit<
    AutoModConfig, "filters" | "obfuscations" | "onBlock"
> {
    blacklist?: (string | RegExp)[];
    whitelist?: (string | RegExp)[];
}

export interface FilterMatch {
    filter: Metadata;
    regex: RegExp;

    match: {
        raw: string;
        normalized: string;
    };

    severity: Severity;
    response?: string;
}

export type Filter = import("../src/classes/filter.js").default;
