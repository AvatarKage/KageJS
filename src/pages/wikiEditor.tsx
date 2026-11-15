
import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import MarkdownEditor from "../components/markdown/Editor.js";

interface WikiPagesResponse {
    pages: string[];
}

interface WikiPageResponse {
    file: string;
    content: string;
}

interface WikiActionResponse {
    success?: boolean;
    file?: string;
}

async function wikiRequest<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...options.headers
        }
    });

    const text = await response.text();

    let data: any = {};

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            throw new Error("The server returned an invalid response.");
        }
    }

    if (!response.ok) {
        throw new Error(data.error ?? `Request failed (${response.status}).`);
    }

    return data as T;
}

function normalizeMarkdownPath(file: string): string {
    let result = file
        .trim()
        .replace(/\\/g, "/")
        .replace(/^\/+/, "");

    if (!result.toLowerCase().endsWith(".md")) {
        result += ".md";
    }

    return result;
}

function getDefaultPageContent(file: string): string {
    const filename =
        file.split("/").pop()?.replace(/\.md$/i, "") ?? "New Page";

    const title = filename
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());

    return `# ${title}\n\n`;
}

const panelClass =
    "border border-base-300 rounded-xl bg-base-200 text-base-content";

const inputClass =
    "w-full min-w-0 rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm text-base-content placeholder:text-sub outline-none focus:border-primary focus:ring-1 focus:ring-primary";

const buttonClass =
    "rounded-lg border border-base-300 bg-base-200 px-3 py-2 text-sm font-medium text-base-content transition hover:bg-base-300 disabled:cursor-not-allowed disabled:opacity-40";

export default function WikiEditor() {
    const [pages, setPages] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState("");
    const [content, setContent] = useState("");

    const [newFile, setNewFile] = useState("");
    const [moveTo, setMoveTo] = useState("");

    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [moving, setMoving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    // Fetch page list.
    const refreshPages = useCallback(async () => {
        const result = await wikiRequest<WikiPagesResponse>(
            "/__wiki-api/pages"
        );

        const updatedPages = result.pages ?? [];

        setPages(updatedPages);

        return updatedPages;
    }, []);

    // Fetch an individual page.
    const loadPage = useCallback(async (file: string) => {
        setLoading(true);
        setError("");
        setNotice("");

        try {
            const result = await wikiRequest<WikiPageResponse>(
                `/__wiki-api/page?file=${encodeURIComponent(file)}`
            );

            setSelectedFile(result.file);
            setContent(result.content);
            setMoveTo("");

            return result;
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not load page."
            );

            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load. No browser navigation or reload.
    useEffect(() => {
        let cancelled = false;

        async function initialize() {
            try {
                const result = await wikiRequest<WikiPagesResponse>(
                    "/__wiki-api/pages"
                );

                if (cancelled) return;

                const initialPages = result.pages ?? [];

                setPages(initialPages);

                if (initialPages.length > 0) {
                    const page = await wikiRequest<WikiPageResponse>(
                        `/__wiki-api/page?file=${encodeURIComponent(initialPages[0])}`
                    );

                    if (!cancelled) {
                        setSelectedFile(page.file);
                        setContent(page.content);
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Could not load pages."
                    );
                }
            }
        }

        initialize();

        return () => {
            cancelled = true;
        };
    }, []);

    // CREATE PAGE
    async function createPage() {
        if (!newFile.trim() || creating) return;

        const file = normalizeMarkdownPath(newFile);

        setCreating(true);
        setError("");
        setNotice("");

        try {
            await wikiRequest<WikiActionResponse>(
                "/__wiki-api/pages",
                {
                    method: "POST",
                    body: JSON.stringify({
                        file,
                        content: getDefaultPageContent(file)
                    })
                }
            );

            // Update sidebar immediately.
            setPages(previous =>
                previous.includes(file)
                    ? previous
                    : [...previous, file].sort()
            );

            setNewFile("");

            // Open the new page.
            const page = await loadPage(file);

            if (page) {
                setNotice("Page created successfully.");
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not create page."
            );
        } finally {
            setCreating(false);
        }
    }

    // SAVE PAGE
    async function savePage(value: string) {
        if (!selectedFile || saving) return;

        setSaving(true);
        setError("");
        setNotice("");

        try {
            await wikiRequest<WikiActionResponse>(
                "/__wiki-api/page",
                {
                    method: "PUT",
                    body: JSON.stringify({
                        file: selectedFile,
                        content: value
                    })
                }
            );

            setContent(value);
            setNotice("Changes saved successfully.");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not save page."
            );

            throw err;
        } finally {
            setSaving(false);
        }
    }

    // MOVE / RENAME PAGE
    async function movePage() {
        if (!selectedFile || !moveTo.trim() || moving) return;

        const oldFile = selectedFile;
        const destination = normalizeMarkdownPath(moveTo);

        if (destination === oldFile) {
            setError("The destination is the same as the current path.");
            return;
        }

        setMoving(true);
        setError("");
        setNotice("");

        try {
            await wikiRequest<WikiActionResponse>(
                "/__wiki-api/move",
                {
                    method: "POST",
                    body: JSON.stringify({
                        from: oldFile,
                        to: destination
                    })
                }
            );

            // Update sidebar without another page-list request.
            setPages(previous =>
                previous
                    .filter(file => file !== oldFile)
                    .concat(destination)
                    .sort()
            );

            // Keep the current content open under its new path.
            setSelectedFile(destination);
            setMoveTo("");

            setNotice("Page moved successfully.");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not move page."
            );
        } finally {
            setMoving(false);
        }
    }

    // DELETE PAGE
    async function deletePage() {
        if (!selectedFile || deleting) return;

        const deletedFile = selectedFile;

        const confirmed = window.confirm(
            `Are you sure you want to permanently delete "${deletedFile}"?`
        );

        if (!confirmed) return;

        setDeleting(true);
        setError("");
        setNotice("");

        try {
            await wikiRequest<WikiActionResponse>(
                `/__wiki-api/page?file=${encodeURIComponent(deletedFile)}`,
                {
                    method: "DELETE"
                }
            );

            const remainingPages = pages.filter(
                file => file !== deletedFile
            );

            // Remove deleted page immediately.
            setPages(remainingPages);

            // Clear current editor.
            setSelectedFile("");
            setContent("");
            setMoveTo("");

            setNotice("Page deleted successfully.");

            // Open the next available page.
            if (remainingPages.length > 0) {
                await loadPage(remainingPages[0]);
                setNotice("Page deleted successfully.");
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not delete page."
            );
        } finally {
            setDeleting(false);
        }
    }

    // REFRESH PAGE LIST
    async function handleRefresh() {
        setError("");
        setNotice("");

        try {
            const updatedPages = await refreshPages();

            // If current page no longer exists, clear the editor.
            if (
                selectedFile &&
                !updatedPages.includes(selectedFile)
            ) {
                setSelectedFile("");
                setContent("");
                setMoveTo("");
            }

            setNotice("Page list refreshed.");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not refresh pages."
            );
        }
    }

    return (
        <div className="min-h-screen w-full min-w-0 space-y-5 bg-base-100 p-4 text-base-content sm:p-6">

            {/* Header */}
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-base-content">
                        Wiki Studio
                    </h1>

                    <p className="mt-1 text-sm text-sub">
                        Create, organize and edit your wiki pages.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    className={buttonClass}
                >
                    ↻ Refresh
                </button>
            </header>

            {/* Feedback */}
            {error && (
                <div
                    role="alert"
                    className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
                >
                    {error}
                </div>
            )}

            {notice && !error && (
                <div
                    role="status"
                    className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
                >
                    {notice}
                </div>
            )}

            {/* Main layout */}
            <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[270px_minmax(0,1fr)]">

                {/* Sidebar */}
                <aside className={`${panelClass} overflow-hidden`}>

                    <div className="border-b border-base-300 p-4">

                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="font-semibold">
                                Pages
                            </h2>

                            <span className="text-xs text-sub">
                                {pages.length} pages
                            </span>
                        </div>

                        {/* Create page */}
                        <form
                            onSubmit={event => {
                                event.preventDefault();
                                createPage();
                            }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                value={newFile}
                                onChange={event => setNewFile(event.target.value)}
                                placeholder="guides/new-page"
                                className={inputClass}
                                aria-label="New page path"
                            />

                            <button
                                type="submit"
                                disabled={!newFile.trim() || creating}
                                className="btn btn-sm btn-primary"
                                title="Create page"
                            >
                                {creating ? "..." : "+"}
                            </button>
                        </form>

                        <p className="mt-2 text-xs text-sub">
                            You can use folders, e.g. guides/install
                        </p>
                    </div>

                    {/* Page list */}
                    <div className="max-h-[65vh] overflow-y-auto p-2">

                        {pages.length > 0 ? (
                            <div className="space-y-1">
                                {pages.map(file => {
                                    const active = selectedFile === file;

                                    return (
                                        <button
                                            key={file}
                                            type="button"
                                            onClick={() => loadPage(file)}
                                            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                                                active
                                                    ? "border border-primary bg-primary text-primary-content"
                                                    : "border border-transparent text-base-content hover:border-base-300 hover:bg-base-300"
                                            }`}
                                        >
                                            <span className="block truncate font-medium">
                                                {file.split("/").pop()}
                                            </span>

                                            {file.includes("/") && (
                                                <span
                                                    className={`mt-1 block truncate text-xs ${
                                                        active
                                                            ? "opacity-70"
                                                            : "text-sub"
                                                    }`}
                                                >
                                                    {file.split("/").slice(0, -1).join("/")}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="px-4 py-10 text-center">
                                <p className="text-sm text-sub">
                                    No Markdown pages found.
                                </p>

                                <p className="mt-1 text-xs text-sub">
                                    Create your first page above.
                                </p>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Editor */}
                <main className="min-w-0 space-y-4">

                    {selectedFile ? (
                        <>
                            {/* Page actions */}
                            <div className={`${panelClass} space-y-3 p-4`}>

                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="min-w-0 flex-1">
                                        <h2 className="truncate font-semibold">
                                            {selectedFile.split("/").pop()}
                                        </h2>

                                        <p className="mt-1 break-all text-xs text-sub">
                                            {selectedFile}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={deletePage}
                                        disabled={deleting}
                                        className="btn btn-sm btn-error"
                                    >
                                        {deleting ? "Deleting..." : "Delete"}
                                    </button>
                                </div>

                                {/* Move / rename */}
                                <form
                                    onSubmit={event => {
                                        event.preventDefault();
                                        movePage();
                                    }}
                                    className="flex flex-wrap gap-2"
                                >
                                    <input
                                        type="text"
                                        value={moveTo}
                                        onChange={event => setMoveTo(event.target.value)}
                                        placeholder="New path, e.g. guides/setup"
                                        className={inputClass + " flex-1"}
                                        aria-label="New page path"
                                    />

                                    <button
                                        type="submit"
                                        disabled={!moveTo.trim() || moving}
                                        className={buttonClass}
                                    >
                                        {moving ? "Moving..." : "Move / Rename"}
                                    </button>
                                </form>
                            </div>

                            {/* Markdown editor */}
                            <div className="min-w-0 h-120 overflow-x-hidden rounded-xl border border-base-300 bg-base-100 text-base-content">
                                {loading ? (
                                    <div className="py-16 text-center text-sub">
                                        Loading page...
                                    </div>
                                ) : (
                                    <MarkdownEditor
                                        key={selectedFile}
                                        initialContent={content}
                                        isEditing
                                        onChange={setContent}
                                        onSave={savePage}
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-base-300 bg-base-200 p-8 text-center">

                            <div className="mb-4 text-4xl text-sub">
                                ◫
                            </div>

                            <h2 className="text-lg font-semibold">
                                Wiki Studio
                            </h2>

                            <p className="mt-2 max-w-sm text-sm text-sub">
                                Select a Markdown page from the sidebar,
                                or create a new page to start writing.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
