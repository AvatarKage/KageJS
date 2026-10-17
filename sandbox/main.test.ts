import { parseDuration, satisfiesAll } from "../packages/utilities/index.js";

const jsonData = {
    string: null,
    number: 1052
};

const num = jsonData.number

type Color = "red" | "green" | "blue";

const colors = satisfiesAll<Color>()(
    "red",
    "green",
    "blue"
);

console.log(JSON.clean(jsonData));
console.log(num.pad(3));
console.log(num.toFormat());
console.log(parseDuration("30s"));
console.log(colors);
