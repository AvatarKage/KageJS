import { variables } from "../variables.js";

export const abbreviations = {
    blacklist: [
        new RegExp(`\\b(?:fc|fk|fw)${variables.ending}\\b`, "iu"),
        "fml",
        "mf",
        "wtf",
        "tf",
        "s***",
        "f***",
        "omg",
        "oml",
        "omfg",
        "omfl",
        "my god*",
        "my lord*",
        "f word*",
        "s word*",
        "n word*",
        "b word*",
        "lmao",
        "lmfao",
        "istg",
        "istl",
        "swear to god*",
        "swear to lord*",
        "🏖️*",
        "⛱️*",
        "*🤬*",
        "stfu",
        "syfm",
        "g word*"
    ]
};
