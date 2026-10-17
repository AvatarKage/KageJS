import cleanJSON from "./src/helpers/cleanJSON.js";

Object.defineProperty(JSON, "clean", {
    value: cleanJSON,
    writable: true,
    configurable: true,
    enumerable: false
});

export {
    //
};
