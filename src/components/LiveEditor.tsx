
import { useCallback, useEffect, useRef, useState } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import { Icon } from "@iconify/react";
import defineCustomTheme from "../scripts/define.js";

/* TYPES */

export interface EditorProp {
    name: string;
    description?: string;
    values?: string[];
    type?: "string" | "boolean" | "number" | "event" | "other";
    defaultValue?: unknown;
    required?: boolean;
}

export interface EditorExample {
    name: string;
    description?: string;
    code: string;
    category?: string;
}

export type ComponentProps = Record<string, EditorProp[]>;

interface LiveComponentEditorProps {
    title?: string;
    description?: string;
    defaultCode: string;
    scope: Record<string, unknown>;
    props: ComponentProps;
    examples?: EditorExample[];
    language?: string;
}

/* EXAMPLE LIBRARY */

function ExampleLibrary({
    examples = [],
    onInsert,
}: {
    examples?: EditorExample[];
    onInsert: (example: EditorExample) => void;
}) {
    const [search, setSearch] = useState("");

    const filtered = examples.filter((example) =>
        `${example.name} ${example.description ?? ""} ${example.category ?? ""}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const groups = Object.groupBy(
        filtered,
        (example) => example.category ?? "Examples"
    );

    return (
        <aside className="flex min-h-[520px] min-w-0 flex-col border-r border-base-300 bg-base-200/30">
            <div className="flex h-11 items-center justify-between border-b border-base-300 px-4">
                <span className="text-[11px] font-semibold tracking-wider">
                    EXAMPLES
                </span>
                <span className="text-xs text-base-content/40">
                    {examples.length}
                </span>
            </div>

            <div className="border-b border-base-300 p-3">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search examples..."
                    className="h-9 w-full rounded-lg border border-base-300 bg-base-100 px-3 text-xs outline-none"
                />
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-3">
                {Object.entries(groups).map(([category, items]) => (
                    <section key={category}>
                        <h3 className="mb-2 text-[10px] font-semibold uppercase text-base-content/40">
                            {category}
                        </h3>

                        {items.map((example) => (
                            <button
                                key={`${category}-${example.name}`}
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => onInsert(example)}
                                className="mb-1 w-full rounded-lg p-2.5 text-left hover:bg-primary/5"
                            >
                                <div className="flex justify-between text-xs font-medium">
                                    {example.name}
                                    <Icon icon="lucide:plus" width={13} />
                                </div>

                                {example.description && (
                                    <p className="mt-1 text-[10px] text-base-content/50">
                                        {example.description}
                                    </p>
                                )}
                            </button>
                        ))}
                    </section>
                ))}

                {filtered.length === 0 && (
                    <p className="py-8 text-center text-xs text-base-content/40">
                        No examples found.
                    </p>
                )}
            </div>
        </aside>
    );
}

/* AUTOCOMPLETE */

function registerAutocomplete(
    monaco: typeof import("monaco-editor"),
    propsRef: React.RefObject<ComponentProps>
) {
    return monaco.languages.registerCompletionItemProvider("typescript", {
        triggerCharacters: [" ", "=", '"', "'", "<"],

        provideCompletionItems(model, position) {
            const text = model.getValueInRange({
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
            });

            // Find the most recent unfinished JSX opening tag
            const tagStart = text.lastIndexOf("<");
            const tagEnd = text.lastIndexOf(">");

            if (tagStart < 0 || tagStart < tagEnd) {
                return { suggestions: [] };
            }

            const tagText = text.slice(tagStart);
            const tagMatch = tagText.match(/^<([A-Z]\w*)\s+([\s\S]*)$/);

            if (!tagMatch) return { suggestions: [] };

            const component = tagMatch[1];
            const attributes = tagMatch[2];
            const componentProps = propsRef.current[component];

            if (!componentProps) return { suggestions: [] };

            // Suggest values inside quotes
            const valueMatch = attributes.match(
                /([\w$]+)\s*=\s*(["'])([^"']*)$/
            );

            if (valueMatch) {
                const prop = componentProps.find(
                    (item) => item.name === valueMatch[1]
                );

                if (!prop?.values) return { suggestions: [] };

                const valueStart =
                    position.column - valueMatch[3].length;

                return {
                    suggestions: prop.values.map((value) => ({
                        label: value,
                        kind: monaco.languages.CompletionItemKind.EnumMember,
                        insertText: value,
                        filterText: value,
                        range: {
                            startLineNumber: position.lineNumber,
                            endLineNumber: position.lineNumber,
                            startColumn: valueStart,
                            endColumn: position.column,
                        },
                        sortText: "0",
                    })),
                };
            }

            // Suggest prop names
            const propMatch = attributes.match(/([\w$]*)$/);
            const typed = propMatch?.[1] ?? "";

            return {
                suggestions: componentProps
                    .filter((prop) =>
                        prop.name
                            .toLowerCase()
                            .startsWith(typed.toLowerCase())
                    )
                    .map((prop) => ({
                        label: prop.name,
                        kind: monaco.languages.CompletionItemKind.Property,
                        detail:
                            prop.description ??
                            prop.type ??
                            "Component prop",

                        insertText:
                            prop.type === "boolean"
                                ? `${prop.name}={true}`
                                : prop.type === "number"
                                  ? `${prop.name}={$1}`
                                  : `${prop.name}="$1"`,

                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,

                        // Trigger value suggestions after inserting the prop
                        command: {
                            id: "editor.action.triggerSuggest",
                            title: "Show prop values",
                        },

                        range: {
                            startLineNumber: position.lineNumber,
                            endLineNumber: position.lineNumber,
                            startColumn: position.column - typed.length,
                            endColumn: position.column,
                        },
                    })),
            };
        },
    });
}

/* MAIN EDITOR */

export default function LiveComponentEditor({
    title = "Live Playground",
    description = "Edit and preview your components.",
    defaultCode,
    scope,
    props,
    examples = [],
    language = "typescript",
}: LiveComponentEditorProps) {
    const [code, setCode] = useState(defaultCode);
    const [copied, setCopied] = useState(false);

    const editorRef =
        useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

    const monacoRef = useRef<Monaco | null>(null);
    const propsRef = useRef(props);

    propsRef.current = props;

    useEffect(() => {
        setCode(defaultCode);
    }, [defaultCode]);

    const handleMount = useCallback(
        (
            editor: MonacoEditor.IStandaloneCodeEditor,
            monaco: Monaco
        ) => {
            editorRef.current = editor;
            monacoRef.current = monaco;

            defineCustomTheme(monaco);

            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
                target: monaco.languages.typescript.ScriptTarget.ESNext,
                allowNonTsExtensions: true,
                allowJs: true,
                esModuleInterop: true,
                strict: false,
            });

            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: true,
                noSyntaxValidation: false,
            });

            const provider = registerAutocomplete(monaco, propsRef);

            editor.onDidDispose(() => provider.dispose());
        },
        []
    );

    const insertExample = useCallback((example: EditorExample) => {
        const editor = editorRef.current;
        if (!editor) return;

        const position = editor.getPosition();
        if (!position) return;

        editor.executeEdits("examples", [
            {
                range: {
                    startLineNumber: position.lineNumber,
                    startColumn: position.column,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                },
                text: example.code,
            },
        ]);

        editor.focus();
    }, []);

    const reset = () => setCode(defaultCode);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch (error) {
            console.error("Could not copy code:", error);
        }
    };

    const format = () =>
        editorRef.current
            ?.getAction("editor.action.formatDocument")
            ?.run();

    return (
        <section className="mb-12 overflow-hidden border border-base-300 bg-base-100 shadow-sm">
            {/* HEADER */}

            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 px-5 py-4">
                <div>
                    <h2 className="text-base font-semibold">{title}</h2>
                    <p className="mt-1 text-xs text-base-content/50">
                        {description}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={format}
                        className="btn btn-sm btn-outline"
                    >
                        <Icon icon="lucide:align-left" />
                        Format
                    </button>

                    <button
                        onClick={reset}
                        className="btn btn-sm btn-outline"
                    >
                        <Icon icon="lucide:rotate-ccw" />
                        Reset
                    </button>

                    <button
                        onClick={copy}
                        className="btn btn-sm btn-primary"
                    >
                        <Icon
                            icon={copied ? "lucide:check" : "lucide:copy"}
                        />
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>
            </header>

            <LiveProvider code={code} scope={scope}>
                <div className="overflow-x-auto">
                    <div className="grid min-w-[1000px] grid-cols-[210px_minmax(0,1fr)]">
                        <ExampleLibrary
                            examples={examples}
                            onInsert={insertExample}
                        />

                        <div className="grid min-w-0 grid-cols-2">
                            {/* EDITOR */}

                            <div className="min-w-0 border-r border-base-300">
                                <div className="flex h-11 items-center border-b border-base-300 px-5">
                                    <span className="text-[11px] font-semibold">
                                        CODE EDITOR
                                    </span>
                                </div>

                                <Editor
                                    height="520px"
                                    language={language}
                                    path="playground.tsx"
                                    theme="custom-dark"
                                    value={code}
                                    onChange={(value) =>
                                        setCode(value ?? "")
                                    }
                                    onMount={handleMount}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 13,
                                        lineHeight: 23,
                                        padding: { top: 20 },
                                        wordWrap: "on",
                                        automaticLayout: true,
                                        scrollBeyondLastLine: false,
                                        tabSize: 4,

                                        quickSuggestions: {
                                            other: true,
                                            comments: false,
                                            strings: true,
                                        },

                                        suggestOnTriggerCharacters: true,
                                        acceptSuggestionOnEnter: "on",
                                        acceptSuggestionOnCommitCharacter: true,
                                        tabCompletion: "on",
                                        snippetSuggestions: "inline",
                                        wordBasedSuggestions: "off",
                                    }}
                                />
                            </div>

                            {/* PREVIEW */}

                            <div className="flex min-w-0 flex-col">
                                <div className="flex h-11 items-center border-b border-base-300 px-5">
                                    <span className="text-[11px] font-semibold">
                                        LIVE PREVIEW
                                    </span>
                                </div>

                                <div className="min-h-[520px] overflow-auto p-6">
                                    <LivePreview />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <LiveError className="whitespace-pre-wrap border-t border-error/30 bg-error/5 px-5 py-4 font-mono text-xs text-error" />
            </LiveProvider>

            {/* COMPONENT API */}

            <section className="border-t border-base-300 p-4">
                <h3 className="mb-3 text-[11px] font-semibold tracking-wider">
                    COMPONENT API
                </h3>

                <div className="space-y-4">
                    {Object.entries(props).map(
                        ([component, componentProps]) => (
                            <div key={component}>
                                <h4 className="mb-2 text-xs font-semibold">
                                    {component}
                                </h4>

                                <div className="flex flex-wrap gap-2">
                                    {componentProps.map((prop) => (
                                        <div
                                            key={prop.name}
                                            className="rounded-lg border border-base-300 bg-base-200/40 px-3 py-2"
                                        >
                                            <div className="text-xs font-medium">
                                                {prop.name}
                                                {prop.required && (
                                                    <span className="ml-1 text-error">
                                                        *
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-1 text-[10px] text-base-content/50">
                                                {prop.type ?? "string"}
                                            </div>

                                            {prop.description && (
                                                <p className="mt-1 text-[10px] text-base-content/60">
                                                    {prop.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </section>
        </section>
    );
}
