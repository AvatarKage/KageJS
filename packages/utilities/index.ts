import "./src/extensions/json.js";
import "./src/extensions/number.js";

import AdvancedError from "./src/classes/advancedError.js";
import Logger from "./src/classes/logger.js";

import assert from "./src/functions/assert.js";

import parseDuration from "./src/helpers/parseDuration.js";
import { satisfiesAll } from "./src/helpers/satisfiesAll.js";
import slugify from "./src/helpers/slugify.js";

export {
    AdvancedError,
    Logger,

    assert,

    parseDuration,
    satisfiesAll,
    slugify
};
