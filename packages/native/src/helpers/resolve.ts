import os from "node:os";
import path from "node:path";

/**
 * Resolves and normalizes a filesystem path.
 *
 * Supports home directory expansion using `~`.
 *
 * @param input The filesystem path to resolve.
 *
 * @returns The absolute, normalized filesystem path.
 *
 * @throws {TypeError} If the input is not a valid, non-empty string.
 *
 * @example
 * // Resolve the home directory
 * resolve("~");
 *
 * @example
 * // Resolve a path inside the home directory
 * resolve("~/Downloads/Astronomer.mp3");
 *
 * @example
 * // Resolve a relative path
 * resolve("./assets/logo.svg");
 *
 * @example
 * // Resolve an absolute path
 * resolve("/docs/installation.md");
 */
export default function resolve(input: string): string {
    if (typeof input !== "string" || !input.trim()) {
        throw new TypeError("Path must be a non-empty string");
    }

    let resolved = input;

    if (resolved === "~") {
        resolved = os.homedir();
    } else if (resolved.startsWith("~/")) {
        resolved = path.join(os.homedir(), resolved.slice(2));
    }

    return path.resolve(resolved);
}
