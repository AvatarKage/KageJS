
import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Icon } from "@iconify/react";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import { getIconData, type IconifyJSON } from "@iconify/utils";
import rehypeHighlight from "rehype-highlight";

import simpleIcons from "@iconify-json/simple-icons/icons.json";
import lucide from "@iconify-json/lucide/icons.json";
import lucideExtended from "@iconify-json/lucide-extended/icons.json";

import "highlight.js/styles/github-dark.css";
import ZoomableMedia from "./.old/ZoomableMedia.js";
import parseEmbedSize from "./helpers/parseEmbedSize.js";
import { renderEmbed } from "./helpers/renderEmbed.js";

export interface Props {
    content?: string;
    className?: string;
}
interface CollapsibleProps {
    title: string;
    children: React.ReactNode;
}


interface CollapsibleProps {
    title: string;
    children: React.ReactNode;
}


function isSafeContactUrl(url: string): boolean {
  return /^(mailto|tel):/i.test(url.trim());
}

const Collapsible = ({ title, children }: CollapsibleProps) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="rounded-xl border border-base-300 my-4 overflow-hidden">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer items-center gap-4 px-4 py-3 font-semibold text-left"
            >
                <Icon
                    icon="lucide:chevron-right"
                    className={`size-5 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-90" : ""
                    }`}
                />

                <span className="flex-1">
                    {title}
                </span>
            </button>

            <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
            >
                <div className="min-h-0 overflow-hidden">
                    <div className="border-t border-base-300 p-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================
// ICONS
// ============================================================

const iconCollections: Record<string, IconifyJSON> = {
    "lucide-extended": lucideExtended,
    "simple-icons": simpleIcons,
    lucide,
};

function iconExists(icon: string): boolean {
    const [prefix, name] = icon.split(":");
    const collection = iconCollections[prefix];

    return !!collection && !!getIconData(collection, name);
}

// ============================================================
// COLOR PLUGIN
// ============================================================


function remarkColors() {
    const colorMap: Record<string, string> = {
        gray: "#aaaaaa",
        red: "#ef4444",
        green: "#22c55e",
        blue: "#3b82f6",
        yellow: "#eab308",
        orange: "#f97316",
        purple: "#a855f7",
        success: "#22c55e",
        warning: "#eab308",
        error: "#ef4444",
        info: "#3b82f6",
        gold: "#ccaa35",
        silver: "#b7c0c7",
        bronze: "#c88544",
    };

    const colorPattern =
        String.raw`#[\da-f]{3}(?:[\da-f])?|#[\da-f]{6}(?:[\da-f]{2})?|rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+(?:\s*,\s*[\d.]+)?\s*\)|red|green|blue|yellow|gold|silver|bronze|orange|purple|gray|success|warning|error|info`;

    const resolveColor = (color: string) => {
        const normalized = color.toLowerCase().trim();

        return normalized.startsWith("#") ||
            normalized.startsWith("rgb")
            ? normalized
            : colorMap[normalized];
    };

    return (tree: Root) => {
        visit(tree, "text", (node, index, parent) => {
            if (!parent || index == null) return;

            const regex = new RegExp(
                String.raw`\{(${colorPattern})?(?:\|(${colorPattern}))?:([\s\S]+?)\}`,
                "gi"
            );

            const matches = [...node.value.matchAll(regex)];

            if (!matches.length) return;

            const replacements: any[] = [];
            let lastIndex = 0;

            for (const match of matches) {
                const start = match.index!;
                const [, foreground, background, text] = match;

                if (start > lastIndex) {
                    replacements.push({
                        type: "text",
                        value: node.value.slice(lastIndex, start),
                    });
                }

                replacements.push({
                    type: "color",
                    data: {
                        hName: "span",
                        hProperties: {
                            ...(foreground && {
                                dataColor: resolveColor(foreground),
                            }),
                            ...(background && {
                                dataBackground: resolveColor(background),
                            }),
                        },
                    },
                    children: [
                        {
                            type: "text",
                            value: text,
                        },
                    ],
                });

                lastIndex = start + match[0].length;
            }

            if (lastIndex < node.value.length) {
                replacements.push({
                    type: "text",
                    value: node.value.slice(lastIndex),
                });
            }

            parent.children.splice(index, 1, ...replacements);

            return index + replacements.length;
        });
    };
}

// ============================================================
// ICON PLUGIN
// ============================================================

function remarkIcons() {
    return (tree: Root) => {
        visit(tree, "text", (node, index, parent) => {
            if (!parent || index == null) return;

            const parts = node.value.split(
                /(<:[\w-]+(?::[\w-]+)?:>)/g
            );

            if (parts.length === 1) return;

            const replacements = parts.map((part) => {
                // Explicit syntax: <:prefix:name:>
                const explicitMatch = part.match(
                    /^<:([\w-]+):([\w-]+):>$/
                );

                if (explicitMatch) {
                    const icon = `${explicitMatch[1]}:${explicitMatch[2]}`;

                    return {
                        type: "icon",
                        data: {
                            hName: "icon",
                            hProperties: { icon },
                        },
                        children: [],
                    };
                }

                // Automatic syntax: <:heart:>
                const commonMatch = part.match(/^<:([\w-]+):>$/);

                if (commonMatch) {
                    const name = commonMatch[1];
                    const fallbackName = name.replace(/-filled$/, "");

                    const candidates = [
                        `lucide-extended:${name}-filled`,
                        `simple-icons:${fallbackName}`,
                        `lucide:${fallbackName}`,
                    ];

                    const icon = candidates.find(iconExists);

                    if (!icon) {
                        return {
                            type: "text",
                            value: part,
                        };
                    }

                    return {
                        type: "icon",
                        data: {
                            hName: "icon",
                            hProperties: { icon },
                        },
                        children: [],
                    };
                }

                return {
                    type: "text",
                    value: part,
                };
            });

            parent.children.splice(index, 1, ...replacements);

            return index + replacements.length;
        });
    };
}

// ============================================================
// MENTION PLUGIN
// ============================================================

function remarkMentions() {
    return (tree: Root) => {
        visit(tree, "text", (node, index, parent) => {
            if (!parent || index == null) return;

            const regex = /<@([^>]+)>/g;
            const matches = [...node.value.matchAll(regex)];

            if (!matches.length) return;

            const replacements: any[] = [];
            let lastIndex = 0;

            for (const match of matches) {
                const start = match.index!;

                if (start > lastIndex) {
                    replacements.push({
                        type: "text",
                        value: node.value.slice(lastIndex, start),
                    });
                }

                replacements.push({
                    type: "text",
                    value: `@${match[1]}`,
                    data: {
                        hName: "span",
                        hProperties: {
                            className: ["markdown-mention"],
                        },
                    },
                });

                lastIndex = start + match[0].length;
            }

            if (lastIndex < node.value.length) {
                replacements.push({
                    type: "text",
                    value: node.value.slice(lastIndex),
                });
            }

            parent.children.splice(index, 1, ...replacements);

            return index + replacements.length;
        });
    };
}

function remarkDiscord(source: string) {
    return (tree: Root) => {
        visit(tree, "strong", (node) => {
            const start = node.position?.start.offset;
            const end = node.position?.end.offset;

            if (start == null || end == null) return;

            const raw = source.slice(start, end);

            if (raw.startsWith("__") && raw.endsWith("__")) {
                node.data = {
                    ...node.data,
                    hName: "u",
                };
            }
        });

        visit(tree, "paragraph", (node) => {
            const first = node.children[0];

            if (first?.type !== "text") return;

            if (!first.value.startsWith("-# ")) return;

            first.value = first.value.slice(3);

            if (!first.value) {
                node.children.shift();
            }

            node.data = {
                ...node.data,
                hProperties: {
                    ...node.data?.hProperties,
                    className: ["discord-subtext"],
                },
            };
        });
    };
}

function remarkDiscordSpoilers() {
    return (tree: Root) => {
        visit(tree, "text", (node, index, parent) => {
            if (!parent || index == null) return;

            const parts = node.value.split(/(\|\|[\s\S]+?\|\|)/g);

            if (parts.length === 1) return;

            const replacements = parts.map((part) => {
                if (part.startsWith("||") && part.endsWith("||")) {
                    return {
                        type: "spoiler",
                        data: {
                            hName: "span",
                            hProperties: {
                                className: ["discord-spoiler"],
                            },
                        },
                        children: [
                            {
                                type: "text",
                                value: part.slice(2, -2),
                            },
                        ],
                    };
                }

                return {
                    type: "text",
                    value: part,
                };
            });

            parent.children.splice(index, 1, ...replacements);

            return index + replacements.length;
        });
    };
}

function protectAngleBracketUrls(markdown: string) {
    return markdown.replace(
        /<(https?:\/\/[^>\s]+)>/gi,
        (_, url) => `[${url}](${url} "no-embed")`
    );
}

function remarkHeadingIds() {
    return (tree: Root) => {
        const usedIds = new Map<string, number>();

        const getText = (node: any): string => {
            if (node.type === "text" || node.type === "inlineCode") {
                return node.value;
            }

            return node.children?.map(getText).join("") ?? "";
        };

        visit(tree, "heading", (node) => {
            const baseId =
                getText(node)
                    .toLowerCase()
                    .trim()
                    .replace(/[^\p{L}\p{N}\s-]/gu, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+/g, "-") || "section";

            const count = usedIds.get(baseId) ?? 0;
            usedIds.set(baseId, count + 1);

            const id = count === 0 ? baseId : `${baseId}-${count}`;

            node.data = {
                ...node.data,
                hProperties: {
                    ...node.data?.hProperties,
                    id,
                },
            };
        });
    };
}

function MarkdownHeading({
    level,
    children,
    node,
    className,
}: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    children?: React.ReactNode;
    node?: {
        properties?: {
            id?: string;
        };
    };
    className: string;
}) {
    const id = node?.properties?.id;
    const Tag = `h${level}` as const;

    return (
        <Tag id={id} className={`group scroll-mt-24 ${className}`}>
            {children}

            {id && (
                <a
                    href={`#${id}`}
                    aria-label={`Link to ${extractText(children)}`}
                    className="
                        ml-2 inline-block
                        text-base-content/30 no-underline
                        opacity-0 transition-opacity
                        group-hover:opacity-100
                        focus:opacity-100
                    "
                >
                    #
                </a>
            )}
        </Tag>
    );
}

function remarkMarkAngleAutolinks() {
    return (tree: any) => {
        visit(tree, "link", (node: any) => {
            if (
                node.position &&
                node.children?.length === 1 &&
                node.children[0].type === "text" &&
                node.children[0].value === node.url &&
                node.position
            ) {
                // Mark links that originated as angle-bracket autolinks
                node.data = {
                    ...node.data,
                    hProperties: {
                        ...node.data?.hProperties,
                        "data-no-embed": "true",
                    },
                };
            }
        });
    };
}
// ============================================================
// CODE BLOCK
// ============================================================

function extractText(node: React.ReactNode): string {
    if (typeof node === "string" || typeof node === "number") {
        return String(node);
    }

    if (Array.isArray(node)) {
        return node.map(extractText).join("");
    }

    if (React.isValidElement(node)) {
        return extractText(
            (node.props as { children?: React.ReactNode }).children
        );
    }

    return "";
}

function CodeBlock({
    children,
}: {
    children?: React.ReactNode;
}) {
    const [copied, setCopied] = React.useState(false);

    const timeoutRef = React.useRef<
        ReturnType<typeof setTimeout> | null
    >(null);

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const code = extractText(children).replace(/\n$/, "");

    const codeElement = React.Children.toArray(children).find(
        React.isValidElement
    );

    const codeClassName = React.isValidElement(codeElement)
        ? (
            codeElement.props as {
                className?: string;
            }
        ).className
        : undefined;

    const language =
        codeClassName?.match(/language-([\w-]+)/)?.[1] ?? "Code";

    async function copyCode() {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setCopied(false);
                timeoutRef.current = null;
            }, 2000);
        } catch (error) {
            console.error("Failed to copy code:", error);
        }
    }

    return (
        <div className="group relative my-5 overflow-hidden rounded-xl border border-base-300 bg-base-100">
            <div className="flex items-center justify-between border-b border-base-300 bg-base-200/50 px-4 py-2.5">
                <span className="text-xs font-medium uppercase tracking-wider">
                    {language}
                </span>

                <button
                    type="button"
                    onClick={copyCode}
                    className="rounded-md px-2.5 py-1 text-xs font-medium transition hover:bg-white/10 cursor-pointer"
                    aria-label="Copy code"
                >
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>

            <pre className="overflow-x-auto font-mono leading-6 p-2">
                {children}
            </pre>
        </div>
    );
}

// ============================================================
// CALLOUT
// ============================================================

type CalloutType =
    | "info"
    | "question"
    | "success"
    | "warning"
    | "error";

function Callout({
    type,
    title,
    children,
}: {
    type: CalloutType;
    title?: React.ReactNode;
    children: React.ReactNode;
}) {
    const color = type.toLowerCase();

    const isCustomColor =
        color.startsWith("#") ||
        color.startsWith("rgb");

    const childArray = React.Children.toArray(children);

    const isSingleParagraph =
        childArray.length === 1 &&
        React.isValidElement(childArray[0]) &&
        (
            childArray[0].type === "p" ||
            (
                typeof childArray[0].type === "function" &&
                childArray[0].type.name === "p"
            )
        );

    return (
        <blockquote
            className={`
                ${!isCustomColor ? `bg-${color}/10 border-${color}` : ""}
                text-base-content/85 text-sm
                border rounded-xl
                my-6 px-6 leading-7
                ${isSingleParagraph ? "pb-2" : "pb-6"}
            `}
            style={
                isCustomColor
                    ? {
                        borderColor: color,
                        backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
                    }
                    : undefined
            }
        >
            <div
                className={`
                    ${!isCustomColor ? `text-${color}` : ""}
                    text-sm font-semibold
                    flex items-center gap-2 pt-6
                `}
                style={
                    isCustomColor
                        ? { color }
                        : undefined
                }
            >
                {title ?? type}
            </div>

            {children}
        </blockquote>
    );
}

const DASHED_HR_SENTINEL = "DASHED_HR_SENTINEL_8F3A";

const SOLID_TEXT_HR_SENTINEL = "SOLID_TEXT_HR_SENTINEL_8F3A";
const DASHED_TEXT_HR_SENTINEL = "DASHED_TEXT_HR_SENTINEL_8F3A";

const DIVIDER_SENTINEL = "TEXT_DIVIDER_8F3A";

function preprocessHorizontalRules(markdown: string): string {
    const lines = markdown.split(/\r?\n/);
    const output: string[] = [];

    let fenceChar: string | null = null;
    let fenceLength = 0;

    for (const line of lines) {
        const fenceMatch = line.match(/^\s{0,3}(`{3,}|~{3,})/);

        if (fenceMatch) {
            const fence = fenceMatch[1];

            if (fenceChar === null) {
                fenceChar = fence[0];
                fenceLength = fence.length;
            } else if (
                fence[0] === fenceChar &&
                fence.length >= fenceLength
            ) {
                fenceChar = null;
                fenceLength = 0;
            }

            output.push(line);
            continue;
        }

        if (fenceChar !== null) {
            output.push(line);
            continue;
        }

        const match = line.match(
            /^[ \t]*(---|----)[ \t]+(.+?)[ \t]+\1[ \t]*$/
        );

        if (match) {
            const [, marker, text] = match;

            output.push(
                `${DIVIDER_SENTINEL}${marker.length === 4 ? "dashed" : "solid"}\n\n${text}\n\n${DIVIDER_SENTINEL}END`
            );

            continue;
        }

        if (/^[ \t]*----[ \t]*$/.test(line)) {
            output.push(DASHED_HR_SENTINEL);
            continue;
        }

        output.push(line);
    }

    return output.join("\n");
}

function remarkHorizontalRules() {
    return (tree: Root) => {
        const children = tree.children;

        for (let i = 0; i < children.length; i++) {
            const node = children[i];

            if (node.type !== "paragraph" || node.children.length !== 1) {
                continue;
            }

            const child = node.children[0];

            if (child.type !== "text") continue;

            const match = child.value.match(
                /^TEXT_DIVIDER_8F3A(solid|dashed)$/
            );

            if (!match) continue;

            const next = children[i + 1];
            const end = children[i + 2];

            if (
                !next ||
                next.type !== "paragraph" ||
                !end ||
                end.type !== "paragraph" ||
                end.children.length !== 1 ||
                end.children[0].type !== "text" ||
                end.children[0].value !== "TEXT_DIVIDER_8F3AEND"
            ) {
                continue;
            }

            children.splice(i, 3, {
                type: "textDivider",
                style: match[1],
                children: next.children,
                data: {
                    hName: "div",
                    hProperties: {
                        className: [
                            "markdown-text-divider",
                            match[1],
                        ],
                    },
                },
                position: node.position,
            } as any);
        }
    };
}

function remarkHorizontal2Rules() {
    return (tree: Root) => {
        visit(tree, "paragraph", (node, index, parent) => {
            if (!parent || index == null) return;

            if (
                node.children.length === 1 &&
                node.children[0].type === "text" &&
                node.children[0].value.trim() === "DASHED_HR_SENTINEL_8F3A"
            ) {
                parent.children[index] = {
                    type: "thematicBreak",
                    data: {
                        hProperties: {
                            className: ["dashed"],
                        },
                    },
                } as any;
            }
        });
    };
}

const COLLAPSIBLE_SENTINEL = "\uE000";

function preprocessCollapsibles(markdown: string): string {
    const lines = markdown.split(/\r?\n/);
    const output: string[] = [];

    let fenceChar: string | null = null;
    let fenceLength = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detect fenced code block opening or closing.
        const fenceMatch = line.match(/^\s{0,3}(`{3,}|~{3,})/);

        if (fenceMatch) {
            const fence = fenceMatch[1];
            const char = fence[0];

            if (fenceChar === null) {
                fenceChar = char;
                fenceLength = fence.length;
            } else if (
                char === fenceChar &&
                fence.length >= fenceLength
            ) {
                fenceChar = null;
                fenceLength = 0;
            }

            output.push(line);
            continue;
        }

        // Never transform content inside fenced code blocks.
        if (fenceChar !== null) {
            output.push(line);
            continue;
        }

        const match = line.match(/^(\s*)>>>\s*(.*)$/);

        if (!match) {
            output.push(line);
            continue;
        }

        const [, indent, title] = match;

        output.push(`${indent}> ${COLLAPSIBLE_SENTINEL}${title}`);
        output.push(`${indent}>`);

        let j = i + 1;

        while (j < lines.length) {
            const quoted = lines[j].match(/^(\s*)>(?: ?)(.*)$/);

            if (!quoted || quoted[1] !== indent) {
                break;
            }

            output.push(`${indent}> ${quoted[2]}`);
            j++;
        }

        i = j - 1;
    }

    return output.join("\n");
}



// ============================================================
// MARKDOWN COMPONENTS
// ============================================================

const markdownComponents: Components & {
    icon: Components["span"];
} = {
    h1({ children, node }) {
        return (
            <MarkdownHeading
                level={1}
                node={node}
                className="
                    text-4xl font-bold tracking-tight font-display
                    mt-10 mb-5 first:mt-0
                    border-b border-base-300 pb-4
                "
            >
                {children}
            </MarkdownHeading>
        );
    },

    h2({ children, node }) {
        return (
            <MarkdownHeading
                level={2}
                node={node}
                className="
                    text-3xl font-semibold tracking-tight font-display
                    mt-9 mb-4 first:mt-0
                    border-b border-base-300 pb-2
                "
            >
                {children}
            </MarkdownHeading>
        );
    },

    h3({ children }) {
        return (
            <h3 className="
                text-2xl font-semibold tracking-tight
                mt-7 mb-3 first:mt-0
            ">
                {children}
            </h3>
        );
    },

    h4({ children }) {
        return (
            <h4 className="text-xl font-semibold mt-6 mb-2 first:mt-0">
                {children}
            </h4>
        );
    },

    h5({ children }) {
        return (
            <h5 className="text-lg font-semibold mt-5 mb-2 first:mt-0">
                {children}
            </h5>
        );
    },

    h6({ children }) {
        return (
            <h6 className="font-semibold mt-4 mb-2 first:mt-0">
                {children}
            </h6>
        );
    },

    p({ children, className }) {
        const cleanedChildren = React.Children.toArray(children);

        while (
            cleanedChildren.length > 0 &&
            React.isValidElement(cleanedChildren[0]) &&
            cleanedChildren[0].type === "br"
        ) {
            cleanedChildren.shift();
        }

        return (
            <p
                className={[
                    "my-4 first:mt-0",
                    className?.includes("discord-subtext")
                        ? "text-xs text-base-content/75"
                        : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                {cleanedChildren}
            </p>
        );
    },

    u({ children }) {
        return (
            <u className="underline underline-offset-4 decoration-current">
                {children}
            </u>
        );
    },

    strong({ children }) {
        return <strong className="font-bold">{children}</strong>;
    },

    em({ children }) {
        return <em className="font-light">{children}</em>;
    },

    del({ children }) {
        return <del className="text-base-content/50">{children}</del>;
    },

    ul({ children }) {
        return (
            <ul className="list-disc marker:text-base-content/50 ml-6">
                {children}
            </ul>
        );
    },

    ol({ children }) {
        return (
            <ol className="list-decimal marker:text-base-content/50 marker:font-medium ml-6">
                {children}
            </ol>
        );
    },

    li({ children }) {
        return <li className="pl-1 leading-7">{children}</li>;
    },

blockquote({ children }) {
    const childArray = React.Children.toArray(children);

    const firstChild = childArray.find(
        (child) => React.isValidElement(child)
    );

    if (React.isValidElement(firstChild)) {
        const paragraphChildren = React.Children.toArray(
            (firstChild.props as {
                children?: React.ReactNode;
            }).children
        );

        // ====================================================
        // HELPERS
        // ====================================================

        const isEmptyChild = (child: React.ReactNode): boolean => {
            if (
                child === null ||
                child === undefined ||
                typeof child === "boolean"
            ) {
                return true;
            }

            if (typeof child === "string") {
                return child.trim().length === 0;
            }

            if (Array.isArray(child)) {
                return child.every(isEmptyChild);
            }

            return false;
        };

        const removeLeadingEmpty = (
            nodes: React.ReactNode[]
        ): React.ReactNode[] => {
            const result = [...nodes];

            while (result.length > 0) {
                const first = result[0];

                if (
                    typeof first === "string" &&
                    !first.trim()
                ) {
                    result.shift();
                    continue;
                }

                if (
                    React.isValidElement(first) &&
                    first.type === "br"
                ) {
                    result.shift();
                    continue;
                }

                break;
            }

            return result;
        };

        // ====================================================
        // COLLAPSIBLE BLOCKQUOTE (>>>)
        // ====================================================

        const sentinelIndex = paragraphChildren.findIndex(
            (child) =>
                typeof child === "string" &&
                child.includes(COLLAPSIBLE_SENTINEL)
        );

        if (sentinelIndex !== -1) {
            const markerText = paragraphChildren[
                sentinelIndex
            ] as string;

            // Remove the invisible marker but preserve the title text.
            const titleText = markerText
                .replace(COLLAPSIBLE_SENTINEL, "")
                .trimStart();

            const titleNodes = [...paragraphChildren];

            if (titleText.length > 0) {
                titleNodes[sentinelIndex] = titleText;
            } else {
                titleNodes.splice(sentinelIndex, 1);
            }

            const cleanedTitle = removeLeadingEmpty(titleNodes);

            const title =
                cleanedTitle.length > 0
                    ? cleanedTitle
                    : ["Click to Expand"];

            // The first paragraph is the title.
            // Everything after it belongs to the collapsible body.
            const bodyChildren = childArray.filter(
                (child) => child !== firstChild
            );

            const finalBody = bodyChildren.filter(
                (child, index) => {
                    if (isEmptyChild(child)) {
                        return false;
                    }

                    if (
                        index === 0 &&
                        React.isValidElement(child) &&
                        child.type === "br"
                    ) {
                        return false;
                    }

                    return true;
                }
            );

            return (
                <Collapsible title={title}>
                    {finalBody}
                </Collapsible>
            );
        }

        // ====================================================
        // CALLOUT BLOCKQUOTE
        // ====================================================

        // Find the first text node. Markdown elements such as
        // <em>, <strong> and custom icons are kept intact.
        const firstTextIndex = paragraphChildren.findIndex(
            (child) => typeof child === "string"
        );

        const firstText =
            firstTextIndex !== -1
                ? (paragraphChildren[firstTextIndex] as string)
                : "";


        // ====================================================
// CALLOUT LOGIC
// ====================================================

const match = firstText.match(
    /^\s*\[!([^\]]+)\][ \t]*/
);

if (match) {
    const [, type] = match;

    const updatedChildren = [...childArray];
    const index = updatedChildren.indexOf(firstChild);

    // Keep parsed Markdown nodes (bold, italic, icons, etc.)
    const updatedParagraphChildren = [...paragraphChildren];

    const firstTextIndex = updatedParagraphChildren.findIndex(
        (child) => typeof child === "string"
    );

    if (firstTextIndex !== -1) {
        const originalText = updatedParagraphChildren[firstTextIndex] as string;

        updatedParagraphChildren[firstTextIndex] = originalText
            .replace(match[0], "")
            .trimStart();
    }

    // Find the first line break separating the title from the body.
    const breakIndex = updatedParagraphChildren.findIndex(
        (child) =>
            React.isValidElement(child) &&
            child.type === "br"
    );

    // Everything before the first break is the title.
    const titleNodes =
        breakIndex === -1
            ? updatedParagraphChildren
            : updatedParagraphChildren.slice(0, breakIndex);

    const cleanedTitle = titleNodes.filter((child) => {
        if (typeof child === "string") {
            return child.trim().length > 0;
        }

        return !(
            React.isValidElement(child) &&
            child.type === "br"
        );
    });

    // If title and body share a paragraph, preserve everything after the break.
    const inlineBody =
        breakIndex === -1
            ? []
            : updatedParagraphChildren
                  .slice(breakIndex + 1)
                  .filter((child) => {
                      if (typeof child === "string") {
                          return child.trim().length > 0;
                      }

                      return true;
                  });

    // Replace the original paragraph with its body portion,
    // or remove it if the body starts in a subsequent paragraph.
    if (index !== -1) {
        if (inlineBody.length > 0) {
            updatedChildren[index] = React.cloneElement(
                firstChild,
                {},
                ...inlineBody
            );
        } else {
            updatedChildren.splice(index, 1);
        }
    }

    // Remove empty string children without removing actual body elements.
    const finalChildren = updatedChildren.filter((child) => {
        return typeof child !== "string" || child.trim().length > 0;
    });

    return (
        <Callout
            type={type as CalloutType}
            title={cleanedTitle.length > 0 ? cleanedTitle : type}
        >
            {finalChildren}
        </Callout>
    );
}
    }

    // ========================================================
    // NORMAL BLOCKQUOTE
    // ========================================================

    return (
        <blockquote className="
            flex items-center gap-6
            bg-primary/5 text-base-content/85 text-sm
            border-l-4 border-primary rounded-l rounded-r-xl
            my-6 py-2 px-6 leading-7
        ">
            <Icon
                icon="boxicons:quote-left-filled"
                className="text-2xl"
            />

            <div className="flex-1 mt-4">
                {children}
            </div>
        </blockquote>
    );
},


    icon({ node }) {
        const icon = node?.properties?.icon;

        if (typeof icon !== "string") {
            return null;
        }

        return (
            <Icon
                icon={icon}
                className="inline-block align-[-0.15em]"
            />
        );
    },

    span({ children, className, node }) {
        const rawColor = node?.properties?.dataColor;
        const rawBackground = node?.properties?.dataBackground;

        const isValidColor =
            typeof rawColor === "string" &&
            (
                /^#[\da-f]{3}(?:[\da-f])?$|^#[\da-f]{6}(?:[\da-f]{2})?$/i.test(rawColor) ||
                /^rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+(?:\s*,\s*[\d.]+)?\s*\)$/i.test(rawColor)
            );

        const isValidBackground =
            typeof rawBackground === "string" &&
            (
                /^#[\da-f]{3}(?:[\da-f])?$|^#[\da-f]{6}(?:[\da-f]{2})?$/i.test(rawBackground) ||
                /^rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+(?:\s*,\s*[\d.]+)?\s*\)$/i.test(rawBackground)
            );

        const isMention = className
            ?.split(/\s+/)
            .includes("markdown-mention");

        const isSpoiler = className
            ?.split(/\s+/)
            .includes("discord-spoiler");

        return (
            <span
                className={[
                    className,
                    isMention
                        ? "font-semibold bg-primary/10 text-primary rounded-md px-1"
                        : "",
                ].filter(Boolean).join(" ")}
                style={{
                    ...(isValidColor ? { color: rawColor } : {}),
                    ...(isValidBackground
                        ? { backgroundColor: rawBackground }
                        : {}),
                }}
                onClick={
                    isSpoiler
                        ? (event) => {
                            event.currentTarget.classList.toggle("revealed");
                        }
                        : undefined
                }
                role={isSpoiler ? "button" : undefined}
                tabIndex={isSpoiler ? 0 : undefined}
                onKeyDown={
                    isSpoiler
                        ? (event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                event.currentTarget.classList.toggle("revealed");
                            }
                        }
                        : undefined
                }
            >
                {children}
            </span>
        );
    },

    "div": ({ node, children }) => {
        const className = node?.properties?.className;

        if (
            !Array.isArray(className) ||
            !className.includes("markdown-text-divider")
        ) {
            return <div>{children}</div>;
        }

        const isDashed = className.includes("dashed");

        const lineClass = `border-base-300/80 ${
            isDashed ? "border-t-2 border-dashed" : "border-t border-solid"
        }`;

        return (
            <div className="my-8 flex w-full items-center gap-4">
                <span className={`min-w-0 flex-1 ${lineClass}`} />

                <span className="shrink-0 text-center text-sm">
                    {children}
                </span>

                <span className={`min-w-0 flex-1 ${lineClass}`} />
            </div>
        );
    },

    hr({ node }) {
        const className = node?.properties?.className;

        const isDashed =
            Array.isArray(className) &&
            className.includes("dashed");

        return (
            <hr
                className={`my-8 w-full border-base-300/80 ${
                    isDashed ? "border-t-2 border-dashed" : "border-t border-solid"
                }`}
            />
        );
    },

    table({ children }) {
        return (
            <div className="my-6 w-full overflow-hidden rounded-xl border border-base-300">
                <table className="w-full min-w-max border-separate border-spacing-0 text-left text-sm">
                    {children}
                </table>
            </div>
        );
    },

    thead({ children }) {
        return (
            <thead>
                {children}
            </thead>
        );
    },

    tbody({ children }) {
        return (
            <tbody>
                {children}
            </tbody>
        );
    },

    th({ children }) {
        return (
            <th className="
                whitespace-nowrap border-b border-r border-base-300
                bg-base-100/50 px-4 py-3.5
                text-xs font-bold uppercase tracking-wider text-base-content
            ">
                {children}
            </th>
        );
    },

    tr({ children }) {
        return (
            <tr className="odd:bg-base-200 even:bg-base-100/25">
                {children}
            </tr>
        );
    },

    td({ children }) {
        return (
            <td className="
                border-b border-r border-base-300
                px-4 py-3 align-top leading-6 text-base-content/85
            ">
                {children}
            </td>
        );
    },

    input({ checked, type }) {
        if (type !== "checkbox") return null;

        return (
            <input
                type="checkbox"
                checked={checked ?? false}
                readOnly
                className="mr-2 h-4 w-4 align-middle accent-blue-500"
            />
        );
    },

    a({ href, title, children }) {
        if (!href) return <>{children}</>;

        const safeHref =
            /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(href);

        if (!safeHref) return <>{children}</>;

        const isExternal = /^https?:\/\//i.test(href) && !/[<>]/.test(href);
        const isContactLink = isSafeContactUrl(href);

        if (isContactLink) {
            return (
            <a href={href} className="text-blue-500 underline">
                {children}
            </a>
            );
        }

        if (isExternal && title !== "no-embed") {
            const { url, width, height } = parseEmbedSize(href);
            const parsed = new URL(url);

            if (/\.(jpeg|jpg|gif|png|webp|svg|avif)$/i.test(parsed.pathname)) {
                return (
                    <ZoomableMedia
                        src={url}
                        alt={
                            typeof children === "string"
                                ? children
                                : "Image"
                        }
                        className="rounded-xl"
                        style={{
                            ...(width ? { width: `${width}%` } : {}),
                            ...(height ? { height: `${height}%` } : {}),
                            maxWidth: "100%",
                        }}
                    />
                )
            }

            return renderEmbed(href);
        }

        const containsMention = (node: React.ReactNode): boolean =>
            React.Children.toArray(node).some((child) => {
                if (!React.isValidElement(child)) return false;

                const props = child.props as {
                    className?: string;
                    children?: React.ReactNode;
                };

                return (
                    props.className?.split(/\s+/).includes("markdown-mention") ||
                    containsMention(props.children)
                );
            });

        const isMention = containsMention(children);

        return (
            <a
                href={href}
                className={`text-info hover:brightness-110 ${isMention ? "no-underline" : "underline"}`}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
            >
                {children}
            </a>
        );
    },

    spoiler({ children }) {
        return (
            <span
                className="discord-spoiler"
                onClick={(event) => {
                    event.currentTarget.classList.toggle("revealed");
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        event.currentTarget.classList.toggle("revealed");
                    }
                }}
            >
                {children}
            </span>
        );
    },

    collapsible: ({ title, children }: any) => (
        <details className="my-2 group">
            <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold">
            <Icon
                icon="lucide:chevron-right"
                className="size-4 shrink-0 transition-transform group-open:rotate-90"
            />
            {title}
            </summary>

            <div className="mt-2 pl-6">
            {children}
            </div>
        </details>
        ),

    img({ src, alt }) {
        if (!src) return null;

        const {
            url,
            width,
            height,
        } = parseEmbedSize(src);

        return (
            <ZoomableMedia
                src={url}
                alt={alt || "Image"}
                description={alt}
                className="rounded-xl max-w-full"
                style={{
                    ...(width ? { width: `${width}%` } : {}),
                    ...(height ? { height: `${height}%` } : {}),
                    ...(!height ? { height: "auto" } : {}),
                    maxWidth: "100%",
                }}
            />
        );
    },

    code({ children, className }) {
        return (
            <code
                className={`
                    rounded-md bg-base-100/50!
                    px-1.5 py-0.5 font-mono
                    ${className ?? ""}
                `}
            >
                {children}
            </code>
        );
    },

    pre({ children }) {
        return <CodeBlock>{children}</CodeBlock>;
    },
} as Components & {
    icon: Components["span"];
};;

export default function MarkdownRenderer({
    content = "",
    className = "",
}: Props) {
    useEffect(() => {
        const scrollToHash = () => {
            const hash = window.location.hash.slice(1);

            if (!hash) return;

            const id = decodeURIComponent(hash);

            window.requestAnimationFrame(() => {
                document.getElementById(id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            });
        };

        scrollToHash();

        window.addEventListener("hashchange", scrollToHash);

        return () => {
            window.removeEventListener("hashchange", scrollToHash);
        };
    }, [content]);

    return (
        <div className={`prose max-w-none scroll-smooth ${className}`}>
            <ReactMarkdown
                remarkPlugins={[
                    remarkGfm,
                    remarkMarkAngleAutolinks,
                    remarkBreaks,
                    remarkHeadingIds,
                    remarkDiscordSpoilers,
                    remarkColors,
                    remarkIcons,
                    remarkMentions,
                    remarkHorizontalRules,
                    remarkHorizontal2Rules,
                    [remarkDiscord, content],
                ]}
                rehypePlugins={[
                    rehypeHighlight,
                ]}
                components={markdownComponents}
            >
                {protectAngleBracketUrls(preprocessCollapsibles(
                    preprocessHorizontalRules(content)
                ))}
            </ReactMarkdown>
        </div>
    );
}
