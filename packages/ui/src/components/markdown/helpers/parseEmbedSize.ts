interface Props {
    url: string;
    width?: number;
    height?: number;
}

/**
 * Parses embed dimensions from a URL.
 *
 * Supports the following formats:
 * - `=800` → width: 800
 * - `=800x600` → width: 800, height: 600
 *
 * If no dimensions are found, returns the original URL.
 *
 * @param url - The embed URL containing optional dimensions.
 * @returns An object containing the cleaned URL and parsed dimensions.
 *
 * @example
 * parseEmbedSize("https://example.com/embed=800");
 * // { url: "https://example.com/embed", width: 800 }
 *
 * @example
 * parseEmbedSize("https://example.com/embed=800x600");
 * // { url: "https://example.com/embed", width: 800, height: 600 }
 *
 * @example
 * parseEmbedSize("https://example.com/embed");
 * // { url: "https://example.com/embed" }
 */
export default function parseEmbedSize(url: string): Props {
    const match = url.match(/=(\d+)(?:x(\d+))?$/);

    if (!match) {
        return { url };
    }

    return {
        url: url.slice(0, match.index),
        width: Number(match[1]),
        ...(match[2] ? { height: Number(match[2]) } : {}),
    };
}
