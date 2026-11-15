/* eslint-disable @typescript-eslint/no-unused-vars */

import { 
    AutoMod,

    filters,

    toRegex
} from "../packages/automod/index.js";

import { 
    Logger
} from "../packages/utilities/index.js";

export const log = new Logger({
    debugMode: true,
    nerdFonts: true,
    path: "./logs"
});

// Move the filters to variables
const { enUS } = filters;
const { expressions, regional } = enUS;

// Create an automod instance
const automod = new AutoMod({
    id: "automod",
    name: "AutoMod",
    group: "main",

    enabled: true, // disable or enable the automod instnce
    severity: "MODERATE",
    response: "Your message was removed by AutoMod.",

    matchAll: true, // match all filter hits if true, else only first match

    // Does an action on every block; useful for logging
    // See example response at the end of the readme
    onBlock(response) {
        // log.automod(response);
    },

    ignore: {
        obfuscation: false,
        capitalization: false,
        reversed: true, // Experimental reversed text prevention; true is disabled
        spacing: true // Experimental space break prevention; true is disabled
    },

    // By default, obfuscations are built in with dozens per letter
    // Overridding them will remove all
    // obfuscations: {
    //     a: ["4"],
    //     e: ["3"]
    // }

    // Follows the automod configuration unless overridden below
    filters: [
        {
            id: "expressions",
            name: "Expressions Filter",
            group: "clean",

            enabled: true,
            severity: "MODERATE",
            response: "Please keep your messages clean.",

            blacklist: [
                ...expressions.abbreviations.blacklist,
                ...expressions.offensive.blacklist,
                ...expressions.profanity.blacklist,
                ...expressions.sexual.blacklist
            ],

            whitelist: expressions.offensive.whitelist
        },
        {
            id: "regional",
            name: "Regional Filter",
            group: "clean",

            enabled: true,
            severity: "SEVERE",
            response: "Please avoid controversial messages.",

            blacklist: [
                ...regional.extremism.blacklist,
                ...regional.politics.blacklist,
                ...regional.religion.blacklist,
                ...regional.other.blacklist
            ]
        },
        {
            id: "spam",
            name: "Anti-Spam",
            group: "spam",

            enabled: true,
            severity: "MINOR",
            response: "Please avoid spamming characters.",

            blacklist: [
                /(.)\1{12,}/u // Blocks repetitive characters
            ]
        }
    ]
});

// Get automod data
log.automod(automod.id);
log.automod(automod.name);
log.automod(automod.group);
log.automod(automod.severity);
log.automod(automod.response);
log.automod(automod.enabled);
log.automod(automod.ignore?.capitalization);
log.automod(automod.ignore?.obfuscation);
log.automod(automod.ignore?.reversed);
log.automod(automod.ignore?.spacing);
log.automod(automod.matchAll);

// Removes a filter
automod.removeFilter("regional");

// Removes all filters; useful if dynmically reloading
automod.clearFilters();

// Check if a filter exists
log.automod(automod.hasFilter("custom")); // false

// Create a filter
automod.createFilter({
    id: "custom",
    name: "Custom Filter",

    enabled: false,
    severity: "MINOR",

    blacklist: [
        "*", // block all words enforcing whitelist only
    ]
})

log.automod(automod.hasFilter("custom")); // true

// Get a filter
const filter = automod.getFilter("custom");

if (filter) {
    // Enable the filter
    filter.enabled = true;

    // Add a value to the blacklist
    filter.addBlacklist("website"); // "website" on its own
    // filter.addBlacklist("*website"); // "website" and all before it
    // filter.addBlacklist("website*"); // "website" and all after it
    // filter.addBlacklist("*website*"); // "website" and all before and after it
    filter.addBlacklist(/https?:\/\/[^\s]+/i); // all urls

    // Remove a value from the blacklist
    filter.removeBlacklist("*");

    // Preview a generated regex for debugging
    log.automod(toRegex(
        "website-bypass", 
        !automod.ignore.spacing)
    ); // /(?<![\p{L}\p{N}_-])website-bypass(?![\p{L}\p{N}_-])/iu

    // Add a value to the whitelist
    filter.addWhitelist("website-bypass"); // allows despite the wildcard block
    filter.addWhitelist("*avatarkage.com*");

    // Remove a value from the blacklist
    filter.removeWhitelist("website-bypass");
}

// Get all filters as an array
// log.automod(automod.getFilters());

// Normalize the message
log.automod(automod.normalize("w3βs!te")); // ["webste", "website"]

// Test the automod
log.automod(automod.test("https://avatarkage.com/projects/automod")) // { blocked: false }
log.automod(automod.test(
    "Welcome to my w3βs𝔦te!", 
    { 
        author: "AvatarKage", 
        location: "VSC" 
    }
))

// {
//     blocked: true,
//     automod: {
//         id: "automod",
//         name: "AutoMod",
//         group: "main"
//     },
//     matches: [
//         {
//             filter: {
//                 id: "custom",
//                 name: "Custom Filter",
//                 group: "main"
//             },
//             regex: /(?<![\p{L}\p{N}_-])website(?![\p{L}\p{N}_-])/iu,
//             match: {
//                 raw: "w3βs𝔦te",
//                 normalized: "website"
//             },
//             severity: "MINOR",
//             response: "Your message was removed by AutoMod."
//         }
//     ],
//     trigger: {
//         message: {
//             raw: "Welcome to my w3βs𝔦te!",
//             normalized: "welcome to my website"
//         },
//         author: "AvatarKage",
//         location: "VSC"
//     }
// }
