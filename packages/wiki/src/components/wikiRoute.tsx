import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";

import type { WikiProperties } from "../../index.js";
import WikiPage from "./wikiPage.js";
import type { WikiPageType } from "../../types/wiki.type.js";

interface Props {
    url: string;
}

export default function WikiRoute({ url }: Props) {
    const { pathname } = useLocation();

    const [index, setIndex] = useState<WikiProperties[]>([]);
    const [loadedPage, setLoadedPage] = useState<WikiPageType | null>(null);

    const [isIndexLoading, setIsIndexLoading] = useState(true);
    const [error, setError] = useState("");

    const [wikiUpdate, setWikiUpdate] = useState(0);

    const basePath = url.replace(/\/+$/, "");

    useEffect(() => {
        const handleUpdate = () => {
            setWikiUpdate(current => current + 1);
        };

        window.addEventListener(
            "kagejs:wiki-update",
            handleUpdate
        );

        return () => {
            window.removeEventListener(
                "kagejs:wiki-update",
                handleUpdate
            );
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function loadIndex() {
            try {
                setError("");

                const response = await fetch(
                    `${basePath}/_generated/index.json?t=${Date.now()}`
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to load wiki index (${response.status})`
                    );
                }

                const data: unknown = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Wiki index must be a JSON array.");
                }

                if (!cancelled) {
                    setIndex(data as WikiProperties[]);
                    setIsIndexLoading(false);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load wiki index."
                    );

                    setIsIndexLoading(false);
                }
            }
        }

        loadIndex();

        return () => {
            cancelled = true;
        };
    }, [basePath, wikiUpdate]);

    const properties = index.find(
        entry => entry.slug === pathname
    );

    useEffect(() => {
        if (isIndexLoading || error || !properties) return;

        let cancelled = false;

        async function loadMarkdown() {
            try {
                const filePath =
                    `${basePath}${properties!.slug}.md?t=${Date.now()}`;

                const response = await fetch(filePath);

                if (!response.ok) {
                    throw new Error(
                        `Failed to load Markdown (${response.status})`
                    );
                }

                const markdown = await response.text();

                if (!cancelled) {
                    setLoadedPage({
                        markdown,
                        properties: properties!,
                    });

                    setError("");
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load Markdown."
                    );
                }
            }
        }

        loadMarkdown();

        return () => {
            cancelled = true;
        };
    }, [
        basePath,
        isIndexLoading,
        error,
        properties,
        wikiUpdate,
    ]);

    if (isIndexLoading && !loadedPage) {
        return null;
    }

    if (error && !loadedPage) {
        return (
            <div>
                <h1>Wiki loading error</h1>
                <p>{error}</p>
            </div>
        );
    }

    if (!isIndexLoading && !properties) {
        return <Navigate to="/404" replace />;
    }

    if (
        !loadedPage ||
        loadedPage.properties.slug !== properties?.slug
    ) {
        return loadedPage ? (
            <WikiPage
                markdown={loadedPage.markdown}
                properties={loadedPage.properties}
            />
        ) : null;
    }

    return (
        <WikiPage
            markdown={loadedPage.markdown}
            properties={loadedPage.properties}
        />
    );
}
