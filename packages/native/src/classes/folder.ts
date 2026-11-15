
import fs from "node:fs";
import path from "node:path";

import resolve from "../helpers/resolve.js";
import File from "./file.js";

/**
 * Options for creating directories.
 */
export interface FolderCreateOptions {
    recursive?: boolean;
    mode?: number;
}

/**
 * Options for deleting directories.
 */
export interface FolderDeleteOptions {
    recursive?: boolean;
}

/**
 * Represents a directory on the filesystem.
 *
 * Provides methods for listing, creating, checking,
 * and deleting directory contents.
 *
 * @example
 * const downloads = Folder.open("~/Downloads");
 * const files = downloads.list();
 */
export default class Folder {
    /**
     * Absolute normalized directory path.
     */
    public path: string;

    /**
     * Creates a Folder instance.
     *
     * Does not create a physical directory.
     *
     * @param folderPath Directory path.
     */
    constructor(folderPath: string) {
        this.path = resolve(folderPath);
    }

    /**
     * Opens an existing directory.
     *
     * @param folderPath Directory path.
     * @returns Folder instance.
     * @throws If the directory does not exist or is not a directory.
     */
    public static open(folderPath: string): Folder {
        return new Folder(resolve(folderPath));
    }

    /**
     * Creates this directory on the filesystem.
     *
     * @param options Directory creation options.
     * @returns This Folder instance.
     */
    public create(options: FolderCreateOptions = {}): this {
        fs.mkdirSync(this.path, {
            recursive: options.recursive ?? false,
            mode: options.mode
        });

        return this;
    }

    /**
     * Lists directory contents.
     *
     * @returns Array containing File and Folder instances.
     */
    public list(): (File | Folder)[] {
        return fs.readdirSync(this.path).map(name => {
            const itemPath = path.join(this.path, name);
            const stats = fs.statSync(itemPath);

            return stats.isDirectory()
                ? new Folder(itemPath)
                : new File(itemPath);
        });
    }

    /**
     * Gets files inside this directory.
     *
     * @returns Array of File instances.
     */
    public files(): File[] {
        return this.list().filter(
            (item): item is File => item instanceof File
        );
    }

    /**
     * Gets subdirectories.
     *
     * @returns Array of Folder instances.
     */
    public folders(): Folder[] {
        return this.list().filter(
            (item): item is Folder => item instanceof Folder
        );
    }

    /**
     * Checks whether this directory exists.
     *
     * @returns True if the directory exists.
     */
    public exists(): boolean {
        try {
            return fs.statSync(this.path).isDirectory();
        } catch {
            return false;
        }
    }

    /**
     * Gets filesystem metadata for this directory.
     *
     * @returns Directory statistics.
     * @throws If the directory does not exist or cannot be accessed.
     */
    public stat(): fs.Stats {
        return fs.statSync(this.path);
    }

    /**
     * Deletes this directory.
     *
     * @param options Deletion options.
     * @returns True when successful.
     */
    public delete(options: FolderDeleteOptions = {}): boolean {
        fs.rmSync(this.path, {
            recursive: options.recursive ?? true,
            force: false
        });

        return true;
    }

    /**
     * Renames this directory.
     *
     * @param newName New directory name.
     * @returns This Folder instance.
     * @throws If the destination already exists or the operation fails.
     */
    public rename(newName: string): this {
        if (
            !newName ||
            newName === "." ||
            newName === ".." ||
            path.basename(newName) !== newName
        ) {
            throw new TypeError("A valid directory name is required.");
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
     * Moves this directory into another directory.
     *
     * @param folderPath Destination directory path.
     * @returns This Folder instance.
     * @throws If the operation fails.
     */
    public move(folderPath: string): this {
        const destination = path.join(resolve(folderPath), this.name);

        fs.renameSync(this.path, destination);

        this.path = destination;

        return this;
    }

    /**
     * Gets the directory name.
     */
    public get name(): string {
        return path.basename(this.path);
    }

    /**
     * Gets the parent directory path.
     */
    public get parent(): string {
        return path.dirname(this.path);
    }
}
