# Todo

DUMMY EXAMPLES, NOT REAL CODE OR IMPORTS, MANY WON'T EXIST

```ts
    // @kagejs/core; Shared foundational services
    import {
        env,
        events,
        cache,
        config,
        logger,
        validator,
        crypto,
        uuid,
    } from "@kagejs/core";

    // @kagejs/utilities; General-purpose helper functions
    import {
        formatDate,
        formatBytes,
        debounce,
        throttle,
        retry,
        clamp,
        random,
        sleep,
    } from "@kagejs/utilities";

    // @kagejs/native; Native system APIs
    import {
        filesystem,
        notifications,
        clipboard,
        system,
        shell,
        dialog,
        tray,
    } from "@kagejs/native";

    // @kagejs/server; Backend services
    import {
        http,
        router,
        middleware,
        database,
        auth,
        session,
        cookies,
        websocket,
    } from "@kagejs/server";

    // @kagejs/client; Client-side services
    import {
        api,
        fetcher,
        store,
        state,
        storage,
        query,
    } from "@kagejs/client";

    // @kagejs/ui; UI components and styling
    import {
        Button,
        Input,
        Modal,
        Card,
        Table,
        Dropdown,
        Toast,
        Theme,
        CSS,
    } from "@kagejs/ui";

    // @kagejs/cli; Project commands
    import {
        build,
        shutdown,
        restart,
    } from "@kagejs/cli";


    const word = "cat";

    const def = word.define();

    // OR

    const wiki = new Wiki();

    const defination = wiki.define("cat");
```

/* eslint-disable @typescript-eslint/ban-ts-comment */

/* CONCEPT; NOT LIVE CODE */

// @ts-ignore
import { formatNumber } from "@kagejs/utilities";

console.log(formatNumber(1000).short);

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

/*
const settings = files.toml("./settings.toml");

settings.set("volume", 100);
settings.set("theme", "dark");

settings.save();
*/

// @ts-ignore
import { os } from "@kagejs/native";

console.log(os.platform);
console.log(os.arch);
console.log(os.hostname);

console.log(os.homedir);
console.log(os.tmpdir);

console.log(os.memory.total);
console.log(os.memory.free);

console.log(os.cpu.count);
console.log(os.cpu.arch);

console.log(os.uptime);
