/**
 * A manageable URL wrapper for reading and updating URL components.
 *
 * Supports protocols, domains, subdomains, ports, paths, query parameters,
 * and hashes. Uses the native WHATWG URL implementation for URL parsing
 * and serialization, and `tldts` to extract domain information.
 *
 * @example
 * const url = new URL("https://www.example.com/page?q=1#top");
 *
 * url.updateQuery("q", "2");
 * url.updateHash("bottom");
 *
 * console.log(url.href);
 * // "https://www.example.com/page?q=2#bottom"
 *
 * @example
 * const url = new URL("https://api.example.com:8080/v1/users");
 *
 * console.log(url.domain); // "example.com"
 * console.log(url.subdomain); // "api"
 * console.log(url.port); // "8080"
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/URL
 */
export default class URL {
    private readonly url;
    /**
     * Creates a URL wrapper from an absolute URL string.
     *
     * @param input - The absolute URL to parse.
     * @throws {TypeError} If the input is not a valid absolute URL.
     *
     * @example
     * const url = new URL("https://example.com/path");
     */
    constructor(input: string);
    /**
     * Gets the complete serialized URL.
     *
     * Includes the protocol, hostname, port, path, query string, and hash
     * when present.
     *
     * @example
     * new URL("https://example.com/page?q=1#top").href;
     * // "https://example.com/page?q=1#top"
     */
    get href(): string;
    /**
     * Gets the URL origin.
     *
     * For HTTP(S) URLs, the origin consists of the protocol, hostname,
     * and non-default port. Some schemes, such as `file:`, have special
     * origin behavior.
     *
     * @example
     * new URL("https://example.com:8080/page").origin;
     * // "https://example.com:8080"
     */
    get origin(): string;
    /**
     * Gets the URL protocol without the trailing colon.
     *
     * @example
     * new URL("https://example.com").protocol;
     * // "https"
     */
    get protocol(): string;
    /**
     * Gets the complete hostname, including any subdomains.
     *
     * Does not include the port.
     *
     * @example
     * new URL("https://api.example.com:8080").fullHost;
     * // "api.example.com"
     */
    get fullHost(): string;
    /**
     * Gets the registrable domain, including its public suffix.
     *
     * Returns `null` when a registrable domain cannot be determined.
     *
     * @example
     * new URL("https://www.example.com").domain;
     * // "example.com"
     *
     * @example
     * new URL("https://localhost:3000").domain;
     * // null
     */
    get domain(): string | null;
    /**
     * Gets the subdomain portion of the hostname.
     *
     * Returns `null` when the hostname has no subdomain.
     *
     * @example
     * new URL("https://api.example.com").subdomain;
     * // "api"
     *
     * @example
     * new URL("https://example.com").subdomain;
     * // null
     */
    get subdomain(): string | null;
    /**
     * Gets the explicit port number as a string.
     *
     * Returns an empty string when no non-default port is present.
     *
     * @example
     * new URL("https://example.com:8080").port;
     * // "8080"
     *
     * @example
     * new URL("https://example.com").port;
     * // ""
     */
    get port(): string;
    /**
     * Gets the URL pathname.
     *
     * The pathname starts with `/` and excludes the query string and hash.
     *
     * @example
     * new URL("https://example.com/docs/page?q=1#top").path;
     * // "/docs/page"
     */
    get path(): string;
    /**
     * Gets query parameters as a plain object.
     *
     * If a query key occurs multiple times, only its last value is retained.
     * Use the native `URLSearchParams` API if you need repeated values.
     *
     * @example
     * new URL("https://example.com/?page=2&sort=name").query;
     * // { page: "2", sort: "name" }
     */
    get query(): Record<string, string>;
    /**
     * Gets the URL fragment without the leading `#`.
     *
     * Returns an empty string when no hash is present.
     *
     * @example
     * new URL("https://example.com/page#section-2").hash;
     * // "section-2"
     */
    get hash(): string;
    /**
     * Updates the URL protocol.
     *
     * Accepts the protocol with or without a trailing colon.
     *
     * @param protocol - The new protocol, such as `"https"` or `"http:"`.
     * @throws {Error} If the protocol is not supported by this wrapper.
     *
     * @example
     * const url = new URL("http://example.com");
     * url.updateProtocol("https");
     *
     * console.log(url.href);
     * // "https://example.com/"
     */
    updateProtocol(protocol: string): void;
    /**
     * Updates the registrable domain while preserving the current subdomain.
     *
     * @param domain - The new domain, such as `"example.org"`.
     * @throws {Error} If the resulting hostname is invalid.
     *
     * @example
     * const url = new URL("https://api.example.com");
     * url.updateDomain("example.org");
     *
     * console.log(url.href);
     * // "https://api.org/"  <-- See note below.
     */
    updateDomain(domain: string): void;
    /**
     * Updates the subdomain while preserving the registrable domain.
     *
     * Pass an empty string to remove the subdomain.
     *
     * @param sub - The new subdomain, such as `"api"` or `"www"`.
     * @throws {Error} If the current URL has no registrable domain.
     *
     * @example
     * const url = new URL("https://www.example.com");
     * url.updateSubdomain("api");
     *
     * console.log(url.href);
     * // "https://api.example.com/"
     *
     * @example
     * url.updateSubdomain("");
     * // "https://example.com/"
     */
    updateSubdomain(sub: string): void;
    /**
     * Updates the URL pathname.
     *
     * Automatically adds a leading slash if one is missing.
     *
     * @param path - The new path.
     *
     * @example
     * const url = new URL("https://example.com/old");
     * url.updatePath("docs/guide");
     *
     * console.log(url.path);
     * // "/docs/guide"
     */
    updatePath(path: string): void;
    /**
     * Updates the URL port.
     *
     * Pass an empty string or `undefined` to remove the explicit port.
     * The port must be an integer between 0 and 65535.
     *
     * @param port - The port number or numeric string.
     * @throws {RangeError} If the port is outside the supported range.
     *
     * @example
     * const url = new URL("https://example.com");
     * url.updatePort(8080);
     *
     * console.log(url.href);
     * // "https://example.com:8080/"
     *
     * @example
     * url.updatePort();
     * // Removes the explicit port.
     */
    updatePort(port?: string | number): void;
    /**
     * Sets or removes a query parameter.
     *
     * Existing values for the key are replaced. Pass `undefined` or an
     * empty string to delete the parameter.
     *
     * @param key - The query parameter name.
     * @param value - The value to set, or empty/undefined to remove it.
     *
     * @example
     * const url = new URL("https://example.com/?page=1");
     * url.updateQuery("page", "2");
     * url.updateQuery("sort", "name");
     *
     * console.log(url.href);
     * // "https://example.com/?page=2&sort=name"
     *
     * @example
     * url.updateQuery("page");
     * // Removes the "page" parameter.
     */
    updateQuery(key: string, value?: string): void;
    /**
     * Updates or removes the URL fragment.
     *
     * The leading `#` is optional. Pass an empty string or `undefined`
     * to remove the fragment.
     *
     * @param value - The new fragment value.
     *
     * @example
     * const url = new URL("https://example.com/page#old");
     * url.updateHash("section-2");
     *
     * console.log(url.href);
     * // "https://example.com/page#section-2"
     *
     * @example
     * url.updateHash();
     * // "https://example.com/page"
     */
    updateHash(value?: string): void;
    /**
     * Converts the URL into a structured object.
     *
     * Useful for logging, debugging, serialization, and API responses.
     *
     * @returns An object containing the URL's components.
     */
    toJSON(): {
        protocol: string;
        domain: string | null;
        subdomain: string | null;
        query: Record<string, string>;
        hash: string;
        path: string;
        port: string;
        href: string;
        origin: string;
    };
    /**
     * Returns the complete URL string.
     *
     * Called implicitly when the instance is converted to a string.
     *
     * @example
     * const url = new URL("https://example.com/page");
     * console.log(url.toString());
     */
    toString(): string;
    /**
     * Validates a hostname by assigning it to a temporary native URL,
     * then applies it to the current URL.
     *
     * @internal
     */
    private setHostname;
}
