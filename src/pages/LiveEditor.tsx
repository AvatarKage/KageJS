/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useState } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import {
    LiveProvider,
    LivePreview,
    LiveError,
} from "react-live";
import defineCustomTheme from "../scripts/define.js";

export interface EditorProp {
    name: string;
    description?: string;
    values?: string[];
    type?: "string" | "boolean" | "number" | "event" | "other";
}

export interface LiveComponentEditorProps {
    title?: string;
    description?: string;
    defaultCode: string;
    scope: Record<string, unknown>;
    props: EditorProp[];
    language?: string;
}

const WRAPPER_OPEN =
    '<div className="flex flex-wrap items-center gap-3">';

const WRAPPER_CLOSE = "</div>";

function removeWrapper(code: string): string {
    const openingIndex = code.indexOf(WRAPPER_OPEN);

    if (openingIndex === -1) {
        return code;
    }

    const contentStart = openingIndex + WRAPPER_OPEN.length;

    const divRegex = /<\/?div\b[^>]*>/gi;
    divRegex.lastIndex = contentStart;

    let depth = 1;
    let match: RegExpExecArray | null;
    let closingIndex = -1;

    while ((match = divRegex.exec(code)) !== null) {
        if (/^<div\b/i.test(match[0])) {
            depth++;
        } else {
            depth--;
        }

        if (depth === 0) {
            closingIndex = match.index;
            break;
        }
    }

    if (closingIndex === -1) {
        return code;
    }

    return (
        code.slice(0, openingIndex) +
        code.slice(contentStart, closingIndex) +
        code.slice(closingIndex + WRAPPER_CLOSE.length)
    ).trim();
}

function addWrapper(code: string): string {
    return `${WRAPPER_OPEN}
${code}
${WRAPPER_CLOSE}`;
}

function configureAutocomplete(
    monaco: Monaco,
    props: EditorProp[],
) {
    monaco.languages.registerCompletionItemProvider("typescript", {
        triggerCharacters: ["<", " ", "=", '"', "'", "{", "."],

        // @ts-ignore
        provideCompletionItems(model, position) {
            const line = model.getLineContent(position.lineNumber);
            const beforeCursor = line.slice(0, position.column - 1);

            const tagMatch = beforeCursor.match(
                /<([A-Z]\w*)\b([^<>]*)$/,
            );

            if (!tagMatch) {
                return { suggestions: [] };
            }

            const attributes = tagMatch[2];

            const quotedValueMatch = attributes.match(
                /([\w-]+)\s*=\s*(["'])([^"']*)$/,
            );

            const braceValueMatch = attributes.match(
                /([\w-]+)\s*=\s*\{([^}]*)$/,
            );

            const valueMatch =
                quotedValueMatch ?? braceValueMatch;

            if (valueMatch) {
                const propName = valueMatch[1];

                const currentProp = props.find(
                    (prop) => prop.name === propName,
                );

                if (!currentProp) {
                    return { suggestions: [] };
                }

                const currentValue = quotedValueMatch
                    ? quotedValueMatch[3] ?? ""
                    : braceValueMatch?.[2] ?? "";

                let availableValues =
                    currentProp.values ?? [];

                if (
                    currentProp.type === "boolean" &&
                    availableValues.length === 0
                ) {
                    availableValues = ["true", "false"];
                }

                if (availableValues.length === 0) {
                    return { suggestions: [] };
                }

                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn:
                        position.column - currentValue.length,
                    endColumn: position.column,
                };

                return {
                    suggestions: availableValues
                        .filter((value) =>
                            value.toLowerCase().startsWith(
                                currentValue.toLowerCase(),
                            ),
                        )
                        .map((value) => ({
                            label: value,
                            kind:
                                monaco.languages.CompletionItemKind.Value,
                            insertText: value,
                            range,
                            detail: `${propName} value`,
                            sortText: value,
                            filterText: value,
                            insertTextRules:
                                monaco.languages.CompletionItemInsertTextRule.None,
                        })),
                };
            }

            const propNameMatch = attributes.match(
                /(?:^|\s)([\w-]*)$/,
            );

            if (!propNameMatch) {
                return { suggestions: [] };
            }

            const typedName = propNameMatch[1] ?? "";

            const existingProps = new Set(
                [...attributes.matchAll(/([\w-]+)\s*=/g)].map(
                    (match) => match[1],
                ),
            );

            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn:
                    position.column - typedName.length,
                endColumn: position.column,
            };

            return {
                suggestions: props
                    .filter(
                        (prop) =>
                            !existingProps.has(prop.name) &&
                            prop.name
                                .toLowerCase()
                                .startsWith(typedName.toLowerCase()),
                    )
                    .map((prop) => ({
                        label: prop.name,
                        kind:
                            monaco.languages.CompletionItemKind.Property,
                        insertText: prop.name,
                        range,
                        detail: "Prop",
                        sortText: prop.name,
                        filterText: prop.name,
                    })),
            };
        },
    });
}

/* -------------------------------------------------------
   Live Component Editor
------------------------------------------------------- */

export default function LiveComponentEditor({
    title = "Live Playground",
    description =
        "Edit the code and see your changes in the live preview.",
    defaultCode,
    scope,
    props,
    language = "typescript",
}: LiveComponentEditorProps) {
    const [code, setCode] = useState(
        () => removeWrapper(defaultCode),
    );

    const [copied, setCopied] = useState(false);

    function handleEditorMount(
        _editor: unknown,
        monaco: Monaco,
    ) {
        defineCustomTheme(monaco);
        configureAutocomplete(monaco, props);
    }

    async function copyCode() {
        try {
            await navigator.clipboard.writeText(
                addWrapper(code),
            );

            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch (error) {
            console.error("Failed to copy code:", error);
        }
    }

    function resetCode() {
        setCode(removeWrapper(defaultCode));
    }

    const previewCode = addWrapper(code);

    return (
        <section className="mb-12 overflow-hidden rounded-xl border border-base-300 bg-base-100">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-base-300 px-5 py-4">
                <div>
                    <h2 className="text-base font-semibold tracking-tight">
                        {title}
                    </h2>

                    <p className="mt-1 text-sm text-base-content/50">
                        {description}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={resetCode}
                        className="rounded-lg border border-base-300 px-3 py-2 text-xs font-medium transition-colors hover:bg-base-200"
                    >
                        Reset
                    </button>

                    <button
                        type="button"
                        onClick={copyCode}
                        className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-content transition-opacity hover:opacity-80"
                    >
                        {copied ? "Copied!" : "Copy code"}
                    </button>
                </div>
            </header>

            <LiveProvider
                code={previewCode}
                scope={scope}
            >
                <div className="grid min-w-0 grid-cols-1 xl:grid-cols-2">
                    <div className="min-w-0 border-b border-base-300 xl:border-b-0 xl:border-r">
                        <div className="flex items-center justify-between border-b border-base-300 bg-base-200 px-5 py-3">
                            <span className="text-xs font-medium tracking-wider text-base-content/60">
                                EDITOR
                            </span>

                            <span className="rounded-md border border-base-300 bg-base-100 px-2 py-1 text-[10px] uppercase tracking-wider text-base-content/50">
                                {language}
                            </span>
                        </div>

                        {/* @ts-ignore */}
                        <Editor
                            height="200px"
                            language={language}
                            theme="custom-dark"
                            value={code}
                            // @ts-ignore
                            onChange={(value) => setCode(value ?? "")}
                            onMount={handleEditorMount}
                            options={{
                                minimap: {
                                    enabled: false,
                                },
                                fontSize: 13,
                                padding: {
                                    top: 16,
                                    bottom: 16,
                                },
                                wordWrap: "on",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 4,
                                renderValidationDecorations: "off",

                                wordBasedSuggestions: "off",
                                quickSuggestions: false,
                                suggestOnTriggerCharacters: true,
                                acceptSuggestionOnEnter: "on",
                                tabCompletion: "off",
                                snippetSuggestions: "none",

                                suggest: {
                                    showProperties: true,
                                    showWords: false,
                                    showSnippets: false,
                                    showClasses: false,
                                    showFunctions: false,
                                    showVariables: false,
                                    showConstants: false,
                                    showEnums: false,
                                    showMethods: false,
                                    showModules: false,
                                    showKeywords: false,
                                    showFiles: false,
                                    showReferences: false,
                                    showFolders: false,
                                    showTypeParameters: false,
                                    showUsers: false,
                                    showIssues: false,
                                },
                            }}
                        />
                    </div>

                    <div className="flex min-w-0 flex-col">
                        <div className="flex items-center justify-between border-b border-base-300 px-5 py-3">
                            <span className="text-xs font-medium tracking-wider text-base-content/50">
                                LIVE PREVIEW
                            </span>

                            <span className="flex items-center gap-2 text-xs text-success">
                                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                                Auto-updating
                            </span>
                        </div>

                        <div className="flex min-h-50 flex-1 items-center justify-center overflow-auto p-6 sm:p-8">
                            <div className="w-full">
                                <LivePreview />
                            </div>
                        </div>
                    </div>
                </div>

                <LiveError className="whitespace-pre-wrap border-t border-error/30 bg-error/5 px-5 py-3 font-mono text-xs text-error" />
            </LiveProvider>

            <section className="border-t border-base-300">
                <div className="border-b border-base-300 bg-base-200 px-5 py-3">
                    <h3 className="text-xs font-semibold tracking-wider text-base-content/70">
                        AVAILABLE PROPS
                    </h3>
                </div>

                <div className="flex flex-wrap gap-2 p-4">
                    {props.map((prop) => (
                        <code
                            key={prop.name}
                            className="rounded-md border border-base-300 bg-base-200 px-2.5 py-1.5 text-xs text-base-content/80"
                        >
                            {prop.name}
                        </code>
                    ))}
                </div>
            </section>
        </section>
    );
}
