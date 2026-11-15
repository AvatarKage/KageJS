import { abbreviations } from "./filters/en-US/expressions/abbreviations.js";
import { offensive } from "./filters/en-US/expressions/offensive.js";
import { profanity } from "./filters/en-US/expressions/profanity.js";
import { sexual } from "./filters/en-US/expressions/sexual.js";

import { extremism } from "./filters/en-US/regional/extremism.js";
import { politics } from "./filters/en-US/regional/politics.js";
import { religion } from "./filters/en-US/regional/religion.js";
import { other } from "./filters/en-US/regional/other.js";

export const filters = {
    enUS: {
        expressions: {
            abbreviations,
            offensive,
            profanity,
            sexual
        },
        regional: {
            extremism,
            politics,
            religion,
            other
        }
    }
};
