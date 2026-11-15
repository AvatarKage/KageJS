
import fs from "node:fs";
import path from "node:path";

import resolve from "../helpers/resolve.js";

/**
 * Options for creating a file.
 */
export interface FileCreateOptions {
    mode?: number;
}

/**
 * Represents a file on the filesystem.
 *
 * Provides methods for reading, writing, appending,
 * renaming, deleting, and retrieving file information.
 *
 * Creating an instance does not create a physical file.
 *
 * @example
 * const settings = File.open("~/Downloads/settings.toml");
 * const content = settings.read();
 */
export default class File {
    /**
     * Absolute normalized path to the file.
     */
    public path: string;

    /**
     * Creates a File instance.
     *
     * Does not create a physical file.
     *
     * @param filePath Path to the file.
     */
    constructor(filePath: string) {
        this.path = resolve(filePath);
    }

    /**
     * Opens an existing file.
     *
     * @param filePath Path to the file.
     * @returns File instance.
     * @throws If the file does not exist or is not a file.
     */
    public static open(filePath: string): File {
        return new File(resolve(filePath));
    }

    /**
     * Creates this file on the filesystem.
     *
     * @param options File creation options.
     * @returns This File instance.
     */
    public create(options: FileCreateOptions = {}): this {
        fs.writeFileSync(this.path, "", {
            flag: "wx",
            mode: options.mode
        });

        return this;
    }

    /**
     * Reads file contents as UTF-8 text.
     *
     * @returns File contents.
     */
    public read(): string;

    /**
     * Reads file contents using a specified encoding.
     *
     * @param encoding Text encoding, or null for a Buffer.
     * @returns File contents.
     */
    public read(encoding: BufferEncoding | null): string | Buffer;

    public read(encoding: BufferEncoding | null = "utf8"): string | Buffer {
        return fs.readFileSync(this.path, encoding ?? undefined);
    }

    /**
     * Writes content to the file.
     *
     * Overwrites existing contents.
     *
     * @param content Content to write.
     * @returns Current File instance.
     */
    public write(content: string | Buffer | Uint8Array): this {
        fs.writeFileSync(this.path, content);
        return this;
    }

    /**
     * Appends content to the file.
     *
     * @param content Content to append.
     * @returns Current File instance.
     */
    public append(content: string | Buffer | Uint8Array): this {
        fs.appendFileSync(this.path, content);
        return this;
    }

    /**
     * Prepends content to the beginning of this file.
     *
     * @param content Content to prepend.
     * @returns This File instance.
     */
    public prepend(content: string | Buffer | Uint8Array): this {
        const existing = fs.readFileSync(this.path);

        fs.writeFileSync(this.path, Buffer.concat([
            Buffer.isBuffer(content) ? content : Buffer.from(content),
            existing
        ]));

        return this;
    }

    /**
     * Checks whether the file exists.
     *
     * @returns True if the file exists.
     */
    public exists(): boolean {
        try {
            return fs.statSync(this.path).isFile();
        } catch {
            return false;
        }
    }

    /**
     * Retrieves file metadata.
     *
     * @returns File statistics.
     */
    public stat(): fs.Stats {
        return fs.statSync(this.path);
    }

    /**
     * Deletes the file.
     *
     * @returns True when successful.
     */
    public delete(): boolean {
        fs.unlinkSync(this.path);
        return true;
    }

    /**
     * Renames this file without changing its parent directory.
     *
     * @param newName New file name.
     * @returns This File instance.
     * @throws If the destination already exists or the operation fails.
     */
    public rename(newName: string): this {
        if (
            !newName ||
            newName === "." ||
            newName === ".." ||
            path.basename(newName) !== newName
        ) {
            throw new TypeError("A valid file name is required.");
        }

        const resolved = path.join(this.parent, newName);

        if (resolved === this.path) {
            return this;
        }

        fs.renameSync(this.path, resolved);

        this.path = resolved;

        return this;
    }

    /**
     * Moves this file into another directory.
     *
     * @param folderPath Destination directory path.
     * @returns This File instance.
     * @throws If the operation fails.
     */
    public move(folderPath: string): this {
        const destination = path.join(resolve(folderPath), this.name);

        fs.renameSync(this.path, destination);

        this.path = destination;

        return this;
    }

    /**
     * Gets the filename including its extension.
     */
    public get name(): string {
        return path.basename(this.path);
    }

    /**
     * Gets the file extension.
     */
    public get extension(): string {
        return path.extname(this.path);
    }

    /**
     * Gets the parent directory path.
     */
    public get parent(): string {
        return path.dirname(this.path);
    }
}
