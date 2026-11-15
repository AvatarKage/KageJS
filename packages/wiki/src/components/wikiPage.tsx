import { Link } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MarkdownRenderer from "../../../ui/src/components/markdown/renderer.js";
import { WikiPageType } from "../../types/wiki.type.js";

export default function WikiPage({
    markdown,
    properties: page
}: WikiPageType) {
    const content = markdown?.replace(
        /^\uFEFF?---\r?\n[\s\S]*?\r?\n---\r?\n?/,
        ""
    );

    const metadata = page.metadata;
    const hero = page.hero;

    const hasInfoboxes = (page.infoboxes?.length ?? 0) > 0;

    const title =
        metadata?.title
        ?? hero?.title
        ?? page.slug
    ;

    return (
        <div className="min-h-screen bg-base-200 text-base-content">
            <header className="border-b border-base-300 bg-base-100">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="flex flex-col">
                        <strong className="text-base font-bold">
                            Wiki
                        </strong>

                        <small className="text-xs text-base-content/60">
                            A Markdown powered wiki
                        </small>
                    </Link>

                    <Link
                        to="/editor"
                        className="text-sm transition-colors hover:text-primary"
                    >
                        Edit Wiki
                    </Link>
                </div>
            </header>

            {hero && (
                <section className="relative isolate flex min-h-92 items-end overflow-hidden bg-base-300">
                    {hero.image && (
                        <img
                            src={hero.image}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 -z-20 h-full w-full object-cover"
                        />
                    )}

                    <div className="absolute inset-0 -z-10 bg-linear-to-t from-base-200 via-base-200/70 to-black/20" />

                    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            {hero.title || title}
                        </h1>

                        {hero.subtitle && (
                            <p className="mt-5 max-w-2xl text-sm leading-7 sm:text-base">
                                {hero.subtitle}
                            </p>
                        )}
                    </div>
                </section>
            )}

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                <div
                    className={
                        hasInfoboxes
                            ? "grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12"
                            : "grid grid-cols-1"
                    }
                >
                    <article className="min-w-0">
                        {!hero && (
                            <h1 className="mb-8 border-b border-base-300 pb-5 text-4xl font-bold tracking-tight">
                                {title}
                            </h1>
                        )}

                        {metadata?.description && (
                            <p className="mb-6 text-base-content/70">
                                {metadata.description}
                            </p>
                        )}

                        <MarkdownRenderer
                            content={content}
                            currentSlug={page.slug}
                            className="wiki-article"
                        />
                    </article>

                    {hasInfoboxes && (
                        <aside
                            aria-label="Page information"
                            className="flex min-w-0 flex-col gap-6 lg:sticky lg:top-6"
                        >
                            {page.infoboxes!.map(
                                (infobox, index) => (
                                    <section
                                        key={`${infobox.title}-${index}`}
                                        className="overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-sm"
                                    >
                                        <h2 className="border-b border-base-300 bg-base-300/40 px-4 py-4 text-center text-base font-bold">
                                            {infobox.title}
                                        </h2>

                                        <table className="w-full text-sm">
                                            <tbody>
                                                {Object.entries(
                                                    infobox.fields
                                                ).map(
                                                    ([key, value]) => (
                                                        <tr
                                                            key={key}
                                                            className="border-b border-base-300 last:border-0"
                                                        >
                                                            <th
                                                                scope="row"
                                                                className="w-2/5 px-4 py-3 text-left align-top font-semibold text-base-content/70"
                                                            >
                                                                {key}
                                                            </th>

                                                            <td className="wrap-break-word px-4 py-3 text-right">
                                                                {value}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>

                                    </section>
                                )
                            )}
                        </aside>
                    )}

                </div>
            </main>

            <footer className="border-t border-base-300 bg-base-100">
                <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-center px-4 py-4 text-center text-xs text-base-content/60 sm:px-6 lg:px-8">
                    Wiki
                </div>
            </footer>
        </div>
    );
}
