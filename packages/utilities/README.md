```ts
/* eslint-disable @typescript-eslint/no-unused-vars */

// Import like the comment below if you only want to use the extensions
// import "@kagejs/utilities";

import { 
    AdvancedError,
    Logger,
    Snowflake,

    assert,

    parseDuration, 
    satisfiesAll,
    slugify,

    type LoggerInstance
} from "@kagejs/utilities";

type Color = "red" | "green" | "blue";

export const log = new Logger({
    debugMode: true,
    nerdFonts: true,
    path: "./logs"
});

// Showcases how the logs work; db can be replaced with many predefined scopes
log("info");
log.success("success");
log.warn("warning");
log.error("error");

log.db("database info");
log.db.success("database success");
log.db.warn("database warning");
log.db.error("database error");

log.temp("never saved, only seen in console");
log.warn.temp("never saved, only seen in console");
log.db.temp("never saved, only seen in console");
log.db.warn.temp("never saved, only seen in console");

log.silent("only saved, never seen in console");
log.warn.silent("only saved, never seen in console");
log.db.silent("only saved, never seen in console");
log.db.warn.silent("only saved, never seen in console");

// Wait for pending writes, useful for calling before server shutdown
await log.flush();

// Clears logs 30 days or older
await log.clearLogs(30);

// Create a snowflake instance using eposh and machine number
const snowflake = new Snowflake(
    "2026-01-01T00:00:00.000Z", 
    0
);

// Generate a snowflake
const snowflakeId = snowflake.gen();

log.snowflake(snowflakeId);
log.snowflake(snowflake.decode(snowflakeId));

// Ensures all values inside match the type, else throw TS error
const colors = satisfiesAll<Color>()(
    "red",
    "green",
    "blue"
);

const jsonData = {
    string: "string",
    number: 1052,
    null: null,
    mightBeNull: null
};

// Assert checks
try {
    assert(jsonData.number).isString();
    assert(jsonData.number).isNumber();

    for (const value of [
        jsonData.null, 
        jsonData.mightBeNull
    ]) {
        assert(value).isNull();
    }
} catch (error) {
    log(error);
}

// Removes empty or null values
log(JSON.clean(jsonData)); // { number: 1052 }

// Returns a JSON of formatted numbers
log(jsonData.number.toFormat()); // { string: '1,052', short: '1.1K', long: '1.1 Thousand' }

// Converts a duration string into milliseconds.
log(parseDuration("30s")); // 30000

// Converts strings into compatible slugs
log(slugify("I am a developer!")); // i-am-a-developer

// Extends Error to provide a better debugging experience
try {
    throw new AdvancedError(500, {
        message: "An error occurred while fetching account",
        details: {
            query: "SELECT * FROM accounts",
            userId: "123"
        }
    });
} catch (error) {
    if (error instanceof AdvancedError) {
        log(error);
    } else {
        log("Unknown error:", error);
    }
}
```
