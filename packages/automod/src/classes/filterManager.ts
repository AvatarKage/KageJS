import { AdvancedError, satisfiesAll } from "@kagejs/utilities";

import type { Severity } from "../../types/common.type.js";
import type { Automod } from "../../types/automod.type.js";
import type { FilterConfig, FilterMatch } from "../../types/filter.type.js";

import Filter from "./filter.js";

export const severityOrder = [
    ...satisfiesAll<Severity>()(
        "MINOR",
        "MODERATE",
        "SEVERE"
    )
];

/**
 * Manages the creation, storage, retrieval, removal, and execution
 * of automoderation filters.
 *
 * Maintains an internal cache of Filter instances indexed by their
 * unique identifiers.
 *
 * @remarks
 * Each filter is associated with an {@link Automod} instance and
 * configured through a {@link FilterConfig} object.
 *
 * Duplicate filter identifiers are not permitted.
 *
 * @example
 * const manager = new FilterManager();
 *
 * const filter = manager.create(config, automod);
 *
 * manager.test("Example message");
 */
export default class FilterManager {
    /**
     * Internal cache containing registered filters.
     *
     * Maps each filter identifier to its corresponding Filter instance.
     *
     * @private
     * @type {Map<string, Filter>}
     */
    private cache: Map<string, Filter> = new Map();

    /**
     * Creates and registers a new filter.
     *
     * Validates that the configuration contains a filter identifier
     * and that the identifier has not already been registered.
     *
     * @param config - Configuration used to initialize the filter.
     *
     * @param automod - Automoderation instance associated with the filter.
     *
     * @returns The newly created and registered Filter instance.
     *
     * @throws {AdvancedError} Error code `1100` when the filter identifier
     * is missing.
     *
     * @throws {AdvancedError} Error code `1102` when a filter with the
     * specified identifier already exists.
     *
     * @example
     * const filter = manager.create(filterConfig, automod);
     */
    public create(config: FilterConfig, automod: Automod): Filter {
        if (!config.id) {
            throw new AdvancedError(1100, {
                message: "Missing filter id"
            });
        }

        if (this.cache.has(config.id)) {
            throw new AdvancedError(1102, {
                message: `Filter "${config.id}" already exists`
            });
        }

        const filter = new Filter(config, automod);

        this.cache.set(config.id, filter);

        return filter;
    }

    /**
     * Retrieves a registered filter by its identifier.
     *
     * @param id - Unique identifier of the filter.
     *
     * @returns The matching Filter instance, or `undefined` if no
     * filter is registered with the specified identifier.
     *
     * @example
     * const filter = manager.get("spam-filter");
     */
    public get(id: string): Filter | undefined {
        return this.cache.get(id);
    }

    /**
     * Checks whether a filter is registered.
     *
     * @param id - Unique identifier of the filter.
     *
     * @returns `true` if the filter exists; otherwise, `false`.
     *
     * @example
     * manager.has("spam-filter");
     */
    public has(id: string): boolean {
        return this.cache.has(id);
    }

    /**
     * Removes a registered filter from the manager.
     *
     * Does not return the removed Filter instance.
     *
     * @param id - Unique identifier of the filter to remove.
     *
     * @returns `true` if the filter was successfully removed;
     * otherwise, `false` if the identifier was not found.
     *
     * @example
     * manager.remove("spam-filter");
     */
    public remove(id: string): boolean {
        return this.cache.delete(id);
    }

    /**
     * Removes all registered filters from the manager.
     *
     * Leaves the manager with an empty filter cache.
     *
     * @returns {void}
     *
     * @example
     * manager.clear();
     */
    public clear(): void {
        this.cache.clear();
    }

    /**
     * Retrieves all currently registered filters.
     *
     * Returns a new array containing the cached Filter instances.
     *
     * @returns An array of all registered Filter instances.
     * Returns an empty array if no filters are registered.
     *
     * @example
     * const filters = manager.getAll();
     *
     * @example
     * // Get the number of registered filters.
     * const count = manager.getAll().length;
     */
    public getAll(): Filter[] {
        return [...this.cache.values()];
    }

    /**
     * Tests a message against every registered filter.
     *
     * Executes each filter's test method and combines all resulting
     * matches into a single array.
     *
     * @param message - Message content to evaluate against registered filters.
     *
     * @returns An array containing all FilterMatch results produced
     * by the registered filters.
     *
     * Returns an empty array when no filters produce matches or
     * when no filters are registered.
     *
     * @remarks
     * Results are collected in the order that filters are iterated
     * through in the internal cache.
     *
     * @example
     * const matches = manager.test("Example message");
     *
     * @example
     * // Check whether any filters matched.
     * const hasMatches = manager.test("Example message").length > 0;
     */
    public test(message: string): FilterMatch[] {
        const matches: FilterMatch[] = [];

        for (const filter of this.cache.values()) {
            matches.push(...filter.test(message));
        }

        return matches;
    }
}
