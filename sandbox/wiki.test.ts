/* eslint-disable @typescript-eslint/ban-ts-comment */

// Render markdown-based wiki pages from TS and let KageJS handle the heavy lifting.
// @ts-ignore
import { Page } from "@kagejs/wiki"; // uses "@kagejs/ui" for rendering
// @ts-ignore
import { slugify } from "@kagejs/utilities";

const title = "Kage (Blue Knight)";
const image = "https://cdn.avatarka.ge/kage.png";

const p = new Page({
    title,
    subtitle: "One of the main characters from Dragonights",
    image,
    slug: `docs/wiki/${slugify(title)}`, // Leave blank to auto-slug from title
    allowRobots: true
});

p.addInfobox({
    title: { civilian: "Kage", hero: "Blue Knight" }, // Having ids will enable switching between values
    image: { civilian: image, hero: null }, // If single value without object, it will display for all
    sections: [
        {
            title: "Information",
            fields: {
                name: { label: "Name", value: { civilian: "Kage", hero: "Blue Knight" } },
                species: { label: "Species", value: "Human" },
                nationality: { label: "Nationality", value: "American" }
            },
        },
    ],
});

p.addImage(
    "https://cdn.avatarka.ge/kage_and_blue_knight.png",
    {
        alt: "Kage and Blue Knight",
        caption: "Kage standing next to his Blue Knight identity.",
    }
);

p.addHeader("Overview", { id: "overview",  size: 2 });

// Have TS suggest get values
p.addParagraph(`
    My name is ${p.infobox.get("civilian").name} and I am ${p.infobox.get("hero").name}.
`);

p.addQuote(
    "A digital creator, community leader, and the Blue Knight.",
    {
        attribution: "AvatarKage (creator of Dragonights)",
    }
);

p.addParagraph(`
    ${p.infobox.get("civilian").name} is affiliated with the following organizations:
`);

p.addList([
    {
        text: "Team Dragonight",
        description: "A modern group of heroes",
    },
]);

const html = p.render(); // Renders in React on the client.

console.log(html);
