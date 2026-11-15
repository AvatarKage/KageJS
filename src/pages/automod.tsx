// AI GENERATED PAGE FOR EASE OF TESTING; NOT PART OF KAGEJS

import { useMemo, useState } from "react";

import AutoMod from "../../packages/automod/src/classes/automod.js";

import type { AutoModResponse } from "../../packages/automod/types/automod.type.js";
import type { Source } from "../../packages/automod/types/common.type.js";
import { obfuscations } from "../../packages/automod/src/constants/obfuscations.js";
import { abbreviations } from "../../packages/automod/src/constants/filters/en-US/expressions/abbreviations.js";
import { offensive } from "../../packages/automod/src/constants/filters/en-US/expressions/offensive.js";
import { profanity } from "../../packages/automod/src/constants/filters/en-US/expressions/profanity.js";
import { sexual } from "../../packages/automod/src/constants/filters/en-US/expressions/sexual.js";

type TestError = {
    blocked: false;
    error: string;
};

type TestResult = AutoModResponse | TestError;

export default function AutoModPage() {
    const [input, setInput] = useState("");
    const [userId, setUserId] = useState("test-user");
    const [location, setLocation] = useState("test-location");
    const [copyStatus, setCopyStatus] = useState("");

    const automod = useMemo(() => {
        return new AutoMod({
            id: "main-automod",
            name: "Main AutoMod",

            enabled: true,
            severity: "MODERATE",
            response: "Your message was removed by AutoMod.",

            matchAll: true,
            
            onBlock(response) {
                // Good place to log stuff
                console.log(response);
            },

            ignore: {
                reversed: true
            },

            // MAKE THIS DEFAULT UNLESS OVERRIDEN
            obfuscations,

            filters: [
               /* {
                    id: "profanity",
                    name: "Profanity Filter",
                    group: "language",

                    enabled: true,
                    severity: "MODERATE",
                    response: "Please keep the conversation respectful.",
                    blacklist: [
                        "wildcard*",
                        "fixedword",
                        /https?:\/\/[^\s]+/i
                    ],

                    whitelist: [
                        "wildcard-bypass",
                        "https://google.com/*"
                    ]
                },*/
                {
                    id: "langexp",
                    name: "Experimental Filter",
                    group: "tests",

                    enabled: true,
                    severity: "MODERATE",
                    response: "Please keep the conversation respectful.",
                    blacklist: [
                        ...abbreviations.blacklist,
                        ...offensive.blacklist,
                        ...profanity.blacklist,
                        ...sexual.blacklist
                    ],
                    whitelist: [
                        ...offensive.whitelist
                    ]
                },
                {
                    id: "spam",
                    name: "Anti-Spam",
                    group: "spam",

                    enabled: true,
                    severity: "MINOR",
                    response: "Please avoid spamming characters.",

                    blacklist: [
                        /(.)\1{12,}/u // Blocks repetitive characters
                    ]
                }
            ]
        });
    }, []);

    const source = useMemo<Source>(() => ({
        author: userId,
        location
    }), [userId, location]);

    const result = useMemo<TestResult | null>(() => {
        if (!input.trim()) {
            return null;
        }

        try {
            return automod.test(input, source);
        } catch (error) {
            console.error("AutoMod test failed:", error);

            return {
                blocked: false,
                error: error instanceof Error
                    ? error.message
                    : "An unexpected error occurred."
            };
        }
    }, [automod, input, source]);

    const isError = result !== null && "error" in result;

    const output = useMemo(
        () => result ? JSON.stringify(
            result,
            (key, value) => {
                if (value instanceof RegExp) {
                    return value.toString();
                }

                return value;
            },
            4
        ) : "",
        [result]
    );

    const handleCopy = async () => {
        if (!output || isError) {
            return;
        }

        try {
            await navigator.clipboard.writeText(output);
            setCopyStatus("Copied!");
        } catch {
            setCopyStatus("Copy failed");
        }

        window.setTimeout(() => setCopyStatus(""), 2000);
    };

    const blocked = result !== null
        && !isError
        && result.blocked;

    return (
        <main className="h-dvh w-full overflow-hidden bg-base-200 text-base-content">
            <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col gap-4 p-3 sm:gap-5 sm:p-5 lg:p-6">

                {/* Header */}
                <header className="flex shrink-0 items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-content shadow-lg shadow-primary/20">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 3 20 7v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m9 12 2 2 4-4"
                                />
                            </svg>
                        </div>

                        <div className="min-w-0">
                            <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">
                                AutoMod Playground
                            </h1>
                            <p className="hidden text-xs text-base-content/50 sm:block">
                                Real-time moderation testing
                            </p>
                        </div>
                    </div>

                    <a
                        href="https://www.npmjs.com/package/@avatarkage/automod"
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 rounded-full border border-base-300 bg-base-100 px-3 py-2 text-xs font-medium text-base-content/70 transition hover:border-primary hover:text-primary"
                    >
                        @avatarkage/automod ↗
                    </a>
                </header>

                {/* Source configuration */}
                <section className="grid shrink-0 grid-cols-1 gap-3 rounded-2xl border border-base-300 bg-base-100 p-3 sm:grid-cols-2 sm:p-4">
                    <div className="min-w-0">
                        <label
                            htmlFor="automod-user"
                            className="mb-1.5 block text-xs font-semibold text-base-content/60"
                        >
                            USER ID
                        </label>

                        <input
                            id="automod-user"
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Enter user ID..."
                            className="h-10 w-full rounded-xl border border-base-300 bg-base-200/50 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <div className="min-w-0">
                        <label
                            htmlFor="automod-location"
                            className="mb-1.5 block text-xs font-semibold text-base-content/60"
                        >
                            LOCATION
                        </label>

                        <input
                            id="automod-location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter location..."
                            className="h-10 w-full rounded-xl border border-base-300 bg-base-200/50 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </section>

                {/* Workspace */}
                <section className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-2">

                    {/* Message input */}
                    <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
                        <div className="flex shrink-0 items-center justify-between border-b border-base-300 px-4 py-3 sm:px-5">
                            <div>
                                <h2 className="text-sm font-semibold">
                                    Message input
                                </h2>
                                <p className="mt-0.5 text-xs text-base-content/50">
                                    Enter a message to moderate
                                </p>
                            </div>

                            <span className="rounded-lg bg-base-200 px-2.5 py-1 text-[10px] font-bold tracking-wider text-base-content/50">
                                INPUT
                            </span>
                        </div>

                        <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-4">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type something to moderate..."
                                autoComplete="off"
                                spellCheck={false}
                                className="min-h-0 w-full flex-1 resize-none overflow-y-auto rounded-xl border border-base-300 bg-base-200/50 p-4 font-mono text-sm leading-7 outline-none transition placeholder:text-base-content/30 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />

                            <div className="flex shrink-0 items-center justify-between pt-3 text-xs text-base-content/50">
                                <span>
                                    {input.trim()
                                        ? "Live moderation enabled"
                                        : "Waiting for input"}
                                </span>

                                <span className="font-mono tabular-nums">
                                    {input.length} characters
                                </span>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center justify-between border-t border-base-300 bg-base-200/40 px-4 py-3">
                            <span className="flex items-center gap-2 text-xs text-success">
                                <span className="h-2 w-2 rounded-full bg-success" />
                                Running locally
                            </span>

                            <button
                                type="button"
                                onClick={() => setInput("")}
                                disabled={!input}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-base-content/60 transition hover:bg-base-300 hover:text-base-content disabled:opacity-30"
                            >
                                Clear input
                            </button>
                        </div>
                    </section>

                    {/* Result */}
                    <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
                        <div className="flex shrink-0 items-center justify-between border-b border-base-300 px-4 py-3 sm:px-5">
                            <div>
                                <h2 className="text-sm font-semibold">
                                    Moderation result
                                </h2>
                                <p className="mt-0.5 text-xs text-base-content/50">
                                    AutoMod.test() output
                                </p>
                            </div>

                            <span className="rounded-lg bg-base-200 px-2.5 py-1 text-[10px] font-bold tracking-wider text-base-content/50">
                                JSON
                            </span>
                        </div>

                        <div className="min-h-0 flex-1 overflow-hidden p-3 sm:p-4">
                            {result ? (
                                isError ? (
                                    <div className="h-full overflow-y-auto rounded-xl border border-error/30 bg-error/10 p-4">
                                        <p className="text-sm font-semibold text-error">
                                            AutoMod error
                                        </p>
                                        <p className="mt-2 break-all text-xs text-base-content/70">
                                            {result.error}
                                        </p>
                                    </div>
                                ) : (
                                    <pre className="h-full overflow-auto rounded-xl border border-base-300 bg-base-200/60 p-4 font-mono text-xs leading-6">
                                        <code>{output}</code>
                                    </pre>
                                )
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-base-300 bg-base-200/30 px-6 text-center">
                                    <p className="text-sm font-medium">
                                        No result yet
                                    </p>
                                    <p className="mt-1 text-xs text-base-content/50">
                                        Start typing to run AutoMod.test()
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex shrink-0 items-center justify-between border-t border-base-300 bg-base-200/40 px-4 py-3">
                            <span className="flex items-center gap-2 text-xs text-base-content/60">
                                {isError ? (
                                    <>
                                        <span className="h-2 w-2 rounded-full bg-error" />
                                        Execution error
                                    </>
                                ) : blocked ? (
                                    <>
                                        <span className="h-2 w-2 rounded-full bg-error" />
                                        Message blocked
                                    </>
                                ) : result ? (
                                    <>
                                        <span className="h-2 w-2 rounded-full bg-success" />
                                        Message allowed
                                    </>
                                ) : (
                                    "Ready"
                                )}
                            </span>

                            <button
                                type="button"
                                onClick={handleCopy}
                                disabled={!output || Boolean(isError)}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-base-content/60 transition hover:bg-base-300 hover:text-base-content disabled:opacity-30"
                            >
                                {copyStatus || "Copy result"}
                            </button>
                        </div>
                    </section>
                </section>

                {/* Footer */}
                <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-base-300 pt-3">
                    <p className="text-[10px] text-base-content/40 sm:text-xs">
                        Local execution · No API requests
                    </p>

                    <p className="text-[10px] text-base-content/40 sm:text-xs">
                        @avatarkage/automod
                    </p>
                </footer>
            </div>
        </main>
    );
}
