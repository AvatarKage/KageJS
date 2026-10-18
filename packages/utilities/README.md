```ts
/* eslint-disable @typescript-eslint/no-unused-vars */

// Import like the comment below if you only want to use the extensions
// import "@kagejs/utilities";

import { 
    parseDuration, 
    satisfiesAll,
    slugify
} from "@kagejs/utilities";

const jsonData = {
    string: null,
    number: 1052
};

const num = jsonData.number

type Color = "red" | "green" | "blue";

// Ensures all values inside match the type, else throw TS error
const colors = satisfiesAll<Color>()(
    "red",
    "green",
    "blue"
);

// Removes empty or null values
console.log(JSON.clean(jsonData)); // { numbe: 1052 }

// Adds zeros infront of the number to form a total length
console.log(num.pad(3)); // 003

// Returns a JSON of formatted numbers
console.log(num.toFormat()); // { string: '1,052', short: '1.1K', long: '1.1 Thousand' }

// Converts a duration string into milliseconds.
console.log(parseDuration("30s")); // 30000

// Converts strings into compatible slugs
console.log(slugify("I am a developer!")); // i-am-a-developer
```
