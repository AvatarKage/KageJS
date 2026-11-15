```ts
import { 
    Folder,
    File,
    
    resolve
} from "@kagejs/native";

import { 
    Logger
} from "@kagejs/utilities";

export const log = new Logger({
    debugMode: true,
    nerdFonts: true,
    path: "./logs"
});

// Resolves and normalizes a filesystem path; runs inside Folder and File classes
log.fs(resolve("~")); // "/home/USERNAME"
log.fs(resolve("~/Downloads/Astronomer.mp3")); // "/home/USERNAME/Downloads/Astronomer.mp3"
log.fs(resolve("./assets/logo.svg")); // "/home/USERNAME/kagejs/assets/logo.svg"
log.fs(resolve("/docs/installation.md")); // "/docs/installation.md"

const path = "./sandbox/tmp";

// Open a directory
const tmpFolder = Folder.open(path);

// If directory doesn't exist, create it
if (!tmpFolder.exists()) {
    tmpFolder.create();
}

// Get directory metadata
log.fs(tmpFolder.name); // "tmp"
log.fs(tmpFolder.parent); // "/home/avatarkage/kagejs/sandbox"
log.fs(tmpFolder.path); // "/home/avatarkage/kagejs/sandbox/tmp"
log.fs(tmpFolder.stat()); // fs.Stats type object

// tmpFolder.files(); // Get all directory files
// tmpFolder.folders(); // Get all directory folders
// tmpFolder.list(); // Get all directory files and folders
// tmpFolder.rename("tmp2"); // Rename the directory
// tmpFolder.move("./sandbox/test"); // Move the directory to another directory

// Open a file
const tmpFile = File.open(`${path}/tmp.txt`);

// If file doesn't exist, create it
if (!tmpFile.exists()) {
    tmpFile.create();
}

// Get file metadata
log.fs(tmpFile.name); // "tmp.txt"
log.fs(tmpFile.extension); // "txt"
log.fs(tmpFile.parent); // "/home/avatarkage/kagejs/sandbox/tmp"
log.fs(tmpFile.path); // "/home/avatarkage/kagejs/sandbox/tmp/tmp.txt"
log.fs(tmpFile.stat()); // fs.Stats type object

// tmpFile.rename("test2.txt"); // Rename the file
// tmpFile.move("./sandbox/test"); // Move the file to another directory

// Write to file (overwrite)
tmpFile.write("Subscribe to AvatarKage on YouTube");

// Prepend to existing written content
tmpFile.prepend("Todo:\n");

// Append to existing written content
tmpFile.append("\nhttps://avatarka.ge/youtube");

// Read the file
log.fs(tmpFile.read());

// Delete the file and directory
tmpFile.delete();
tmpFolder.delete();
```
