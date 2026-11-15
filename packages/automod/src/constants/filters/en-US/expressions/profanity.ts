import { variables } from "../variables.js";

export const profanity = {
    blacklist: [
        new RegExp(`(?:🖕|🖕🏻|🖕🏼|🖕🏽|🖕🏾|🖕🏿|\\bmiddle\\s*finger${variables.ending}\\b)`, "iu"), // middle finger
        new RegExp(`\\ba(?:s|rse|z)(?:s|z)\\s*hole${variables.ending}\\b`, "iu"), // asshole
        new RegExp(`\\bb(?:i|1|!|\\|)t(?:c|ch|sh)?h?e?${variables.ending}\\b`, "iu"), // bitch
        new RegExp(`\\bbas(?:t(?:a?r?d?)?)${variables.ending}\\b`, "iu"), // bastard
        new RegExp(`\\bboll(?:ock|okc|ck|kc|c|k)?${variables.ending}\\b`, "iu"), // bollock
        new RegExp(`\\b(?:${variables.subjects})\\s*(?:${variables.beVerbs}\\s+)?(?:a\\s+)?birch${variables.ending}\\b`, "iu"), // [subjects] [beVerbs] a birch
        new RegExp(`\\bf(?:c|k|q|x|v|u)(?:c|k|q|x|v)(?:c|k|q|x|v)?e?${variables.ending}\\b`, "iu"), // fuck
        new RegExp(`\\bass${variables.ending}\\b`, "iu"), // ass
        "arse*",
        "piss*",
        "dumba*",
        "shit*"
    ]
};
