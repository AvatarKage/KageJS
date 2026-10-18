# Todo

DUMMY EXAMPLES, NOT REAL CODE OR IMPORTS, MANY WON'T EXIST

```tsx
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

    // This will generate a breadcrumb visual from that path
    <BreadCrumb path={"root/folder/subfolder"} />
```

/* eslint-disable @typescript-eslint/ban-ts-comment */

/* CONCEPT; NOT LIVE CODE */

// @ts-ignore
import { formatNumber } from "@kagejs/utilities";

console.log(formatNumber(1000).short);

extend console to include console.save() or smth