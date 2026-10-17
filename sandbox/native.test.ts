import { os } from "../packages/native/src/helpers/os.js";

/*
// @ts-ignore
import { files } from "@kagejs/native";

const path = "~/home/username/downloads/settings.toml"
const file = files.get(path);
let content = file.read();

console.log(content);

content = content.replace(/^volume=.*$/m, "volume=100");

file.edit({
    content: content + "\nLast edited: Today"
});

file.save();

file.delete();

files.create(path, {
    content: "volume=50"
});
*/
/*
const settings = files.toml("./settings.toml");

settings.set("volume", 100);
settings.set("theme", "dark");

settings.save();
*/

console.log(await os.cpu());
// console.log(await os.gpu());
