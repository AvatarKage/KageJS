```ts
// import "../packages/utilities/index.js";
import { parseDuration } from "../packages/utilities/index.js";

const jsonData = {
    string: null,
    number: 1052
};

const num = jsonData.number

console.log(JSON.clean(jsonData));
console.log(num.pad(3));
console.log(num.toFormat());
console.log(parseDuration("30s"));
```
