# A showcase of `@kagejs/markdown` 

`@kagejs/markdown` is a component for React.

- Follows [CommonMark](https://commonmark.org/help) (2014+)
- Follows [GitHub Flavored Markdown](https://github.github.com/gfm)
- Includes Discord Flavored Markdown
- Adds KageJS Flavored Markdown
- Supports URL embeds
- Built-in heading anchors with smooth scrolling

### Things to Remember

Types and color names uses your Tailwind CSS variable colors.

`primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error`

`red` list all names here

---

## 1. Headings

Headings are a bit too distracting to display all at once, but you can get a feel for them as they are used throughout this showcase.

Heading level 1 and 2 both use a display font from the `--font-display` CSS variable and have an anchor link at the end.


```syntax
# Heading level 1
## Heading level 2
### Heading level 3
#### Heading level 4
##### Heading level 5
###### Heading level 6
```

---

## 2. Inline Formatting

This is a normal sentence with **bold text**, *italic text*, ***bold and italic text***, ~~strikethrough~~, `inline code`, and [masked link](https://github.com/AvatarKage/KageJS).

This is a {#7b22fd|#7b22fd50:colored} {#7b22fd:text} and {|rgba(123, 34, 253, 0.25):background} from KageJS' own flavor that supports transparency using HEX, RGB and names like {orange:orange}.

-# This is a small __underlined__ text from Discord's own flavor with a spoiler message on the next line. Click it to reveal then click it again to hide!

||What secrets do you hold?||

```syntax
This is a normal sentence with **bold text**, *italic text*, ***bold and italic text***, ~~strikethrough~~, `inline code`, and [masked link](https://github.com/AvatarKage/KageJS).

This is a {#7b22fd|#7b22fd50:colored} {#7b22fd:text} and {|rgba(123, 34, 253, 0.25):background} from KageJS' own flavor that supports transparency using HEX, RGB and names like {orange:orange}.

-# This is a small __underlined__ text from Discord's own flavor with a spoiler message on the next line. Click it to reveal then click it again to hide!

||What secrets do you hold?||
```

---

## 3. Lists

### Todo

- Community Administration
- Coding Projects
  - Cornelia
  - KageJS
    - Markdown Flavor
- Produce Dragonights

```syntax
- Community Administration
- Coding Projects
  - Cornelia
  - KageJS
    - Markdown Flavor
- Produce Dragonights
```

### Ordered List

1. Learn HTML
2. Learn JS
   1. Learn Node
   2. Learn TS
3. Learn React

```syntax
1. Learn HTML
2. Learn JS
   1. Learn Node
   2. Learn TS
3. Learn React
```

### Task List

- [x] Check-in on friends
- [ ] Launch a new app
  - [ ] Hire management staff
- [x] Buy Groceries

```syntax
- [x] Check-in on friends
- [ ] Launch a new app
  - [ ] Hire management staff
- [x] Buy Groceries
```

### Mixed List

1. Prepare this page
   - Add headings
   - Add examples
2. Verify rendering
   - [x] Check lists
   - [ ] Check embeds

```syntax
1. Prepare this page
   - Add headings
   - Add examples
2. Verify rendering
   - [x] Check lists
   - [ ] Check embeds
```

---

## 4. Blockquotes

> *Darkness holds the most beauty, but is overlooked as something to escape.*
> — AvatarKage

```syntax
> QUOTE
> — AUTHOR
```

---

## 5. Callouts

Callouts are a new markdown exclusive to KageJS' flavor. Use them to highlight important things the reader should not overlook.

> [!info] <:akar-icons:info:> Info
> The KageJS ecosystem was created by AvatarKage as the successor to both his `kage-library` node package and scrapped Kage.JS site builder.

> [!#f7df1e] <:akar-icons:chat-question:> How do I download KageJS?
>NodeJS is required to use KageJS. If it is installed, open your terminal and run:
>
>```bash
>npm install @kagejs/utilities @kagejs/native @kagejs/ui @kagejs/markdown @kagejs/wiki
>```

> [!error] <:lucide:octagon-exclamation-point:>  Something went wrong!
Nothing went wrong this time. But if anything ever did, you can report bugs and contribute fixes on our [GitHub repo](https://github.com/AvatarKage/KageJS).

```syntax
> [!info] <:akar-icons:info:> Info
> The KageJS ecosystem was created by AvatarKage as the successor to both his `kage-library` node package and scrapped Kage.JS site builder.
```

```syntax
> [!TYPE_OR_COLOR_NAME] OPTIONAL_TITLE
> YOUR_TEXT

> [!HEX_OR_RGB] OPTIONAL_TITLE
> YOUR_TEXT
```
---

## 6. Collapsibles

Collapsibles are also a new markdown feature exclusive to KageJS' flavor. Use them to hide spammy, but necessary text, or group content to make reading easier.

>>> Click to view headings
> # Heading level 1
> ## Heading level 2
> ### Heading level 3
> #### Heading level 4
> ##### Heading level 5
> ###### Heading level 6

```syntax
>>> OPTIONAL_TITLE
> YOUR_TEXT
```

---

## 7. Discord Inspired

Inspired by Discord's own user mention and emoji markdown, KageJS rewoked them to be usable with links and the entire [Iconify library](https://icon-sets.iconify.design/).

### Icons

Icons can be optionally specified using a library name. By default, KageJS uses automatic resolution when a library name is not provided. It searches Lucide Extended first, then falls back to Simple Icons (for brands) and finally Lucide. Icons can be colored the same way as text.

<:house:> Return to Home
{#5865F2:<:discord:>} Join my Discord
{gray:<:arrow-left:>} Exit Application

```syntax
<:ICON_NAME:>
<:LIBRARY_NAME:ICON_NAME:>
```

### Mentions

- Friends
  - <@Alice>
  - <@Cornelia>
  - <@Mable>
  - <@Mavynn>
  - <@Shade>
- Roles
  - <@Mascot>
  - <@Leader>
  - <@Assistant>

<:youtube:> Subscribe to [<@avatarkage>](https://avatarka.ge/youtube) on YouTube

```syntax
<@USERNAME>
[<@USERNAME>](URL)
```

---

## 8. Horizontal Rules

KageJS expanded CommonMark's horizontal rule. It introduces a dashed varient and gives the option to label them.

---

----

--- I am a horizontal rule with text ---

---- I am a dashed horizontal rule with text ----

```syntax
---
----
--- YOUR_TEXT ---
---- YOUR_TEXT ----
```
---

## 9. Code Blocks

```ts
export function greet(user: string): string {
    return `Hello, ${user}!`;
}

console.log(greet("viewer")); // Hello, viewer!
```

````syntax
```CODING_LANGUAGE
YOUR_CODE
```
````

---

## 10. Tables

| Mod | Loader | Versions | Downloads |
|--|--|--|--|
| {gold:<:trophy:>} [3D Armor](https://modrinth.com/mod/armor-3d) | Forge, NeoForge, Fabric, Quilt | 1.20-26.3+ | 910k |
| {silver:<:trophy:>} [Vexxed](https://modrinth.com/datapack/vexxed) | Forge, NeoForge, Fabric, Quilt, Datapack, Spigot, Paper | 1.14-26.3+ | 120k |
| {bronze:<:trophy:>} [3D Hands](https://modrinth.com/mod/hands-3d) | Forge, NeoForge, Fabric, Quilt | 1.20-26.3+ | 110k |

```syntax
| Mod | Loader | Versions | Downloads |
|--|--|--|--|
| {gold:<:trophy:>} [3D Armor](https://modrinth.com/mod/armor-3d) | Forge, NeoForge, Fabric, Quilt | 1.20-26.3+ | 910k |
| {silver:<:trophy:>} [Vexxed](https://modrinth.com/datapack/vexxed) | Forge, NeoForge, Fabric, Quilt, Datapack, Spigot, Paper | 1.14-26.3+ | 120k |
| {bronze:<:trophy:>} [3D Hands](https://modrinth.com/mod/hands-3d) | Forge, NeoForge, Fabric, Quilt | 1.20-26.3+ | 110k |
```

---

## 11. Link Embeds

To prevent a link from rendering as an embed, wrap it in angle brackets.  

```syntax
<YOUR_LINK>
```

To control the width and height percentage of embeds, add a size value at the end of the URL.

# FIX 800x600 ^ (supported)

```syntax
YOUR_LINK=WIDTH_SIZE_IN_PRCENTAGE
```

### Images

Click an image to open it in a zoomable, draggable modal.

![KageJS logo](https://us-east-1.tixte.net/uploads/cdn.avatarka.ge/kagejs.png=25)

```syntax
![KageJS logo](https://us-east-1.tixte.net/uploads/cdn.avatarka.ge/kagejs.png=25)
```

### YouTube

https://www.youtube.com/watch?v=6BgK6_8TMd4=50

```syntax
https://www.youtube.com/watch?v=6BgK6_8TMd4=50
```

### Spotify

https://open.spotify.com/track/5cZVeH0dqeu8zuC8Oyha4x=50

```syntax
https://open.spotify.com/track/5cZVeH0dqeu8zuC8Oyha4x=50
```


https://vimeo.com/76979871



// YouTube
https://www.youtube.com/watch?v=dQw4w9WgXcQ

// YouTube with custom dimensions
https://www.youtube.com/watch?v=dQw4w9WgXcQ=800x450

// Vimeo
https://vimeo.com/76979871

// Twitch
https://www.twitch.tv/shroud

// Spotify
https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT

// SoundCloud
https://soundcloud.com/artist/track

// TikTok
https://www.tiktok.com/@user/video/1234567890123456789

// Instagram
https://www.instagram.com/p/POST_ID/

// Facebook
https://www.facebook.com/example/posts/123456789

// Apple Music
https://music.apple.com/us/album/example/123456789

// Discord widget
https://discord.com/widget?id=123456789012345678

// X
https://x.com/user/status/123456789

// Reddit
https://www.reddit.com/r/reactjs/comments/example/

// Pinterest
https://www.pinterest.com/pin/123456789/




---


























## 16. Escaping and Special Characters

Literal characters:

\*asterisks\*, \_underscores\_, \#hash, and \<tag\>.

HTML entities:

&amp; &lt; &gt; &quot; &#39;

Backslash escape:

\*this should not be italic\*

Literal Markdown characters:

\# Not a heading

\> Not a blockquote

\- Not a list item


## 18. Wiki Links

These links test path resolution and wiki index matching.

- [Relative page](./another-page.md)
- [Parent directory page](../another-page.md)
- [Guide with underscores](../getting_started/Quick_Start.md)
- [Root page](/index.md)
- [Page with spaces](./My%20Page.md)

A missing wiki page should receive the missing-page styling.

[This page probably does not exist](./definitely-missing-test-page.md)

---

## More info?

Much more info is available in the
[readme on GitHub](https://github.com/remarkjs/react-markdown)!

***

A component by [Espen Hovlandsdal](https://espen.codes/)


