/* eslint-disable @typescript-eslint/no-unused-vars */

// Import like the comment below if you only want to use the extensions
// import "../packages/utilities/index.js";

import { 
    parseDuration, 
    satisfiesAll,
    slugify,
    Logger
} from "../packages/utilities/index.js";

const log = new Logger({
    debugMode: false, // If debug true, display and save all logs, else only errors
    userNerdFonts: true,
    path: "logs/discord",
    customEntries: { // Concept of adding custom entries
        channel: "NERDFONT_ICON_HERE" // [CHANNEL] all caps if not nerdfonts
    }
});

// Logger update removes the .save(), .tree(), and the "unknown" log categoy, and would 
// make it compatible on client without user modifications while enforcing save to file 
// on server end instead of making it optional. If the user doesn't want to save, either 
// disable debugMode or use temp. It would also no longer require a log level.

log.temp("This will never save and will display in white."); // will be marked as [TEMP] or temp icon if nerdfonts
log.silent("This will save and will not display in console."); // will be marked as [SILENT] or temp icon if nerdfonts
log.discord("This will save and display in white.");
log.discord.temp("This will never save and will display in white."); // will be marked as [DISCORD TEMP] or relevant icon if nerdfonts
log.discord.info("This will save and display in green.");
log.discord.info.temp("This will never save and will display in green.");



const log = new Logger({
    path: "logs/discord",
    nerdFonts: true,

    categories: {
        discord: "󰙯",
        guild: "󰙯",
        channel: "󰆍",
        message: "󰍡",
        command: "󰘳",
        interaction: "󰌷",
        event: "󰣖",
        voice: "󰓃",
        member: "󰀄",
        role: "󰓎",
        permission: "󰌾",
        database: "󰆼",
        cache: "󰃨",
        api: "󰒍",
        network: "󰛳",
        websocket: "󰖟",
        shard: "󰒋",
        plugin: "󰐱",
        scheduler: "󰥔",
        config: "󰒓",
    },
});

// Basic; the new default, gray instead of white
log.discord("Connected to Discord.");
log.command("Executed /help");
log.database("Connection established.");

// Severity
log.discord.success("Bot ready!"); // Green
log.command.warn("Missing permissions."); // Yellow
log.database.error("Connection failed."); // Red

// Temporary (never written to disk)
log.discord.temp("Connecting...");
log.command.temp("Processing interaction...");
log.database.error.temp("Retrying connection...");

// Root logging
log.info("Application started."); // or just log("")
log.warn("High memory usage.");
log.error("Unexpected error.");
log.success("Initialization complete.");
log.temp("Temporary information.");









const jsonData = {
    string: null,
    number: 1052
};

type Color = "red" | "green" | "blue";

// Ensures all values inside match the type, else throw TS error
const colors = satisfiesAll<Color>()(
    "red",
    "green",
    "blue"
);

// Removes empty or null values
console.log(JSON.clean(jsonData)); // { number: 1052 }

// Returns a JSON of formatted numbers
console.log(jsonData.number.toFormat()); // { string: '1,052', short: '1.1K', long: '1.1 Thousand' }

// Converts a duration string into milliseconds.
console.log(parseDuration("30s")); // 30000

// Converts strings into compatible slugs
console.log(slugify("I am a developer!")); // i-am-a-developer
