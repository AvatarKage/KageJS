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

```ts
// THE CONTENTS OF THE EXAMPLE WIKI ARE TAKEN FROM THE DRAGONIGHTS WIKI
// CONTENT SUBJECT TO COPYRIGHT

// Maybe call this on index.ts or smth or auto gen
page.addTableOfContents([
    "Overview",
    "Biography",
    "Personality",
    "Appearance",
    "Abilities",
    "Affiliations",
    "Trivia",
    "References",
]);

// Render markdown-based wiki pages from TS and let KageJS handle the heavy lifting.
import { Page, slugify } from "@kagejs/wiki"; // uses "@kagejs/ui" for rendering

const title = "Create A Page"

const p = new Page({
    slug: `docs/wiki/${slugify(ti)}`
});






p.allowRobots(true)





const page = new Page({
    title: "AvatarKage (Blue Knight)",
    slug: "character/avatarkage_blue_knight"
});

page.addTitle("AvatarKage");
page.addSubtitle("The Blue Knight");

page.addImage(
    "https://example.com/avatarkage.png",
    {
        alt: "AvatarKage, the Blue Knight",
        caption: "AvatarKage in his Blue Knight identity.",
    }
);

page.addInfobox({
    title: "AvatarKage",
    image: "https://example.com/avatarkage.png",

    sections: [
        {
            title: "Biographical information",
            fields: [
                ["Full name", "AvatarKage"],
                ["Alias", "Blue Knight"],
                ["Species", "Human"],
                ["Nationality", "American"],
            ],
        },
        {
            title: "Professional information",
            fields: [
                ["Occupation", "Digital creator"],
                ["Specialties", "Community leadership, brand management, AI development"],
                ["Affiliation", "Team Dragonight"],
                ["Role", "Leader and public representative"],
            ],
        },
        {
            title: "Abilities",
            fields: [
                ["Power source", "Cyeletal crystal"],
                ["Known abilities", "Dormant electrical manipulation"],
            ],
        },
    ],
});

page.addQuote(
    "A digital creator, community leader, and the Blue Knight.",
    {
        attribution: "Character overview",
    }
);

page.addHeader("Contents", { size: 1 });

page.addHeader("Overview", { id: "overview",  size: 2 });

page.addParagraph(
    "AvatarKage, also known as Blue Knight, is a character " +
    "associated with the Dragonights universe. He is depicted " +
    "as an American digital creator with interests in community " +
    "leadership, brand management, and artificial intelligence."
);

page.addHeader("Biography", { id: "biography" });

page.addParagraph(
    "AvatarKage was created in May 2015 as an alternate-reality " +
    "version of the real-life creator behind Dragonights. " +
    "Although the exact creation date is unknown, May 13, 2015, " +
    "has been recognized as the character's anniversary."
);

page.addHeader("Personality", { id: "personality" });

page.addParagraph(
    "AvatarKage's characterization can be expanded here with " +
    "verified details about his personality, values, motivations, " +
    "and relationships."
);

page.addHeader("Appearance", { id: "appearance" });

page.addParagraph(
    "This section describes AvatarKage's appearance as the " +
    "Blue Knight, including his clothing, armor, colors, and " +
    "other distinguishing features."
);

page.addHeader("Abilities", { id: "abilities" });

page.addParagraph(
    "AvatarKage possesses dormant electrical manipulation " +
    "abilities associated with a cyeletal crystal."
);

page.addList([
    "Electrical manipulation: a dormant ability associated with a cyeletal crystal.",
]);

page.addHeader("Affiliations", { id: "affiliations" });

page.addList([
    {
        text: "Team Dragonight",
        description: "An organization with which AvatarKage is affiliated.",
    },
]);

page.addHeader("Trivia", { id: "trivia" });

page.addList([
    "AvatarKage was created in May 2015.",
    "The character is an alternate-reality version of the creator.",
    "May 13 is recognized as the character's anniversary.",
]);

page.addHeader("References", { id: "references" });

page.addList([
    {
        text: "Dragonights Wiki",
        description: "AvatarKage (Blue Knight)",
        url: "https://www.dragonights.wiki/character/avatarkage_blue_knight",
    },
]);

const html = page.render();
```

maybe add a timer to the logger so there can be a start and end or smth
