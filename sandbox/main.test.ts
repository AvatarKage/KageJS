import "../packages/utilities/index.js";

const jsonData = {
    name: null,
    age: 23
};

const age = jsonData.age

console.log(JSON.clean(jsonData));
console.log(age.pad(3));
