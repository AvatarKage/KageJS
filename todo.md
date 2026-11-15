# Todo

DUMMY EXAMPLES, NOT REAL CODE OR IMPORTS, MANY WON'T EXIST

```tsx
    // @kagejs/cli; Project commands
    import {
        build,
        shutdown,
        restart,
    } from "@kagejs/cli";

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
        copy
        paste
        download
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


    const word = "cat";

    const def = word.define();

    // OR

    const wiki = new Wiki();

    const defination = wiki.define("cat");

    // This will generate a breadcrumb visual from that path
    <BreadCrumb path={"root/folder/subfolder"} />
```

/* eslint-disable @typescript-eslint/ban-ts-comment */

/* CONCEPT; NOT LIVE CODE */

// @ts-ignore
import { formatNumber } from "@kagejs/utilities";

console.log(formatNumber(1000).short);

extend console to include console.save() or smth

maybe add a timer to the logger so there can be a start and end or smth

add remaining asserts

ensure all throw new Error are replaced with AdvancedError and that their error codes are added if needed under 1000

add a high-contrast ui option to the style so enabling a high-contrast theme will ensure elements are reflecting that

kagejs, make a avatar element with loading, decoration, image, animated, etc

// import { os } from "../src/.old/os.js";

// console.log(await os.cpu());
// console.log(await os.gpu());
