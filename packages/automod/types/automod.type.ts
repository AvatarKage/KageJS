import type { Metadata, Severity, Source } from "./common.type.js";
import type { FilterConfig, FilterMatch } from "./filter.type.js";
import type { ObfuscationConfig } from "./obfuscation.type.js";

export interface AutoModConfig extends Metadata {
    enabled?: boolean;
    matchAll?: boolean;

    severity: Severity;
    response?: string;

    ignore?: {
        obfuscation?: boolean;
        capitalization?: boolean;
        reversed?: boolean;
        spacing?: boolean;
    }

    obfuscations?: ObfuscationConfig;
    filters?: FilterConfig[];

    onBlock?: (response: AutoModResponse) => void;
}

export type Trigger = Source & {
    message: {
        raw: string;
        normalized: string;
    };
};

export type AutoModResponse =
    | {
        blocked: false;
    }
    | {
        blocked: true;
        automod: Metadata;
        matches: FilterMatch[];
        trigger: Trigger;
    };

export type Automod = import("../src/classes/automod.js").default;
