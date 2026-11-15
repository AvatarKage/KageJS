import type { AutoModConfig, AutoModResponse } from "../../types/automod.type.js";
import type { Severity, Source } from "../../types/common.type.js";
import type { Filter, FilterConfig, FilterMatch } from "../../types/filter.type.js";

import { obfuscations } from "../constants/obfuscations.js";

import FilterManager, { severityOrder } from "./filterManager.js";
import ObfuscationManager from "./obfuscationManager.js";

/**
 * Provides an automoderation system for evaluating messages against
 * configured filters, detecting obfuscated content, and generating
 * moderation responses.
 *
 * Manages filter registration, message normalization, severity-based
 * match prioritization, and moderation callbacks.
 *
 * Each AutoMod instance maintains its own collection of filters and
 * obfuscation mappings.
 *
 * @remarks
 * The AutoMod class acts as the primary entry point for the moderation
 * system.
 *
 * It coordinates:
 * - Filter management through {@link FilterManager}.
 * - Character normalization through {@link ObfuscationManager}.
 * - Message evaluation through registered filters.
 * - Severity-based match sorting.
 * - Moderation response generation.
 * - Optional execution of the `onBlock` callback.
 *
 * @example
 * const automod = new AutoMod({
 *     id: "chat-moderation",
 *     enabled: true,
 *     severity: "MODERATE",
 *     filters: []
 * });
 *
 * const result = automod.test("Example message");
 */
export default class AutoMod {
    /**
     * Unique identifier of the AutoMod instance.
     *
     * @type {string}
     */
    public id: string;

    /**
     * Optional display name of the AutoMod instance.
     *
     * @type {string | undefined}
     */
    public name?: string;

    /**
     * Optional group identifier associated with this AutoMod instance.
     *
     * Can be inherited by filters that do not define their own group.
     *
     * @type {string | undefined}
     */
    public group?: string;

    /**
     * Determines whether the automoderation system is enabled.
     *
     * When disabled, {@link test} immediately returns an unblocked
     * response without evaluating the message.
     *
     * Defaults to `true` when not explicitly configured.
     *
     * @type {boolean | undefined}
     */
    public enabled: boolean;

    /**
     * Determines whether all matching filters should be included
     * in the moderation response.
     *
     * When `true`, every matching filter is included.
     *
     * When `false`, only the highest-severity matching filter
     * is included.
     *
     * Defaults to `false`.
     *
     * @type {boolean | undefined}
     */
    public matchAll: boolean;

    /**
     * Default severity assigned to filters that do not specify
     * their own severity.
     *
     * Defaults to `MODERATE`.
     *
     * @type {Severity}
     */
    public severity: Severity;

    /**
     * Optional default response associated with moderation matches.
     *
     * Can be inherited by filters that do not define their own response.
     *
     * @type {string | undefined}
     */
    public response?: string;

    /**
     * Controls which message normalization and detection behaviors
     * should be ignored by associated filters.
     *
     * Individual filters inherit this configuration unless they
     * provide their own ignore settings.
     *
     * @property {boolean} [obfuscation] - Disables obfuscation normalization.
     * @property {boolean} [capitalization] - Disables capitalization normalization.
     * @property {boolean} [reversed] - Disables reversed-text detection.
     * @property {boolean} [spacing] - Disables advanced spacing detection.
     *
     * @type {{
     *     obfuscation?: boolean;
     *     capitalization?: boolean;
     *     reversed?: boolean;
     *     spacing?: boolean;
     * } | undefined}
     */
    public ignore: {
        obfuscation: boolean;
        capitalization: boolean;
        reversed: boolean;
        spacing: boolean;
    };

    /**
     * Manages character-level obfuscation mappings.
     *
     * Used to generate alternative representations of messages
     * for obfuscation-aware filter matching.
     *
     * @private
     * @type {ObfuscationManager}
     */
    private obfuscations: ObfuscationManager;

    /**
     * Manages the filters registered with this AutoMod instance.
     *
     * Handles filter creation, retrieval, removal, and message evaluation.
     *
     * @private
     * @type {FilterManager}
     */
    private filters: FilterManager;

    /**
     * Optional callback executed when a message is blocked.
     *
     * Receives the completed AutoModResponse containing the moderation
     * result and matching filter information.
     *
     * @private
     * @type {((response: AutoModResponse) => void) | undefined}
     */
    private onBlock?: (response: AutoModResponse) => void;

    /**
     * Creates and initializes an AutoMod instance.
     *
     * Configures the automoderation settings, initializes obfuscation
     * and filter managers, registers the optional blocking callback,
     * and creates any filters supplied in the configuration.
     *
     * @param config - Configuration defining the AutoMod instance,
     * including its identifier, settings, obfuscation mappings,
     * filters, and optional blocking callback.
     *
     * @example
     * const automod = new AutoMod({
     *     id: "chat-moderation",
     *     name: "Chat Moderation",
     *     enabled: true,
     *     matchAll: false,
     *     severity: "MODERATE",
     *     filters: []
     * });
     *
     * @remarks
     * Default configuration:
     * - `enabled` defaults to `true`.
     * - `matchAll` defaults to `false`.
     * - `severity` defaults to `MODERATE`.
     * - `response` defaults to `"Your message has been blocked by automod."`.
     * - `ignore.obfuscation` defaults to `false`.
     * - `ignore.capitalization` defaults to `false`.
     * - `ignore.reversed` defaults to `true`.
     * - `ignore.spacing` defaults to `true`.
     * - `obfuscations` defaults to the imported predefined mappings.
     * - `filters` defaults to an empty array.
     *
     * Each configured filter is registered through {@link createFilter}.
     */
    constructor(config: AutoModConfig) {
        this.id = config.id;
        this.name = config.name;
        this.group = config.group;

        this.enabled = config.enabled ?? true;
        this.matchAll = config.matchAll ?? false;

        this.severity = config.severity ?? "MODERATE";
        this.response = config.response ?? "Your message has been blocked by automod.";

        this.ignore = {
            obfuscation: config.ignore?.obfuscation ?? false,
            capitalization: config.ignore?.capitalization ?? false,
            reversed: config.ignore?.reversed ?? true,
            spacing: config.ignore?.spacing ?? true
        };

        this.obfuscations = new ObfuscationManager(config.obfuscations ?? obfuscations);
        this.filters = new FilterManager();

        this.onBlock = config.onBlock;

        for (const filterConfig of config.filters ?? []) {
            this.createFilter(filterConfig);
        }
    }

    /**
     * Creates and registers a new filter with this AutoMod instance.
     *
     * Associates the supplied filter configuration with the current
     * AutoMod instance, allowing the filter to inherit its default
     * configuration.
     *
     * @param config - Configuration defining the filter to create.
     *
     * @returns The newly created and registered Filter instance.
     *
     * @throws {AdvancedError} Error code `1100` if the filter identifier
     * is missing.
     *
     * @throws {AdvancedError} Error code `1102` if a filter with the
     * same identifier already exists.
     *
     * @example
     * const filter = automod.createFilter({
     *     id: "spam-filter",
     *     blacklist: ["spam"]
     * });
     */
    public createFilter(config: FilterConfig): Filter {
        return this.filters.create(config, this);
    }

    /**
     * Retrieves a registered filter by its identifier.
     *
     * @param id - Unique identifier of the filter.
     *
     * @returns The matching Filter instance, or `undefined` if
     * no filter exists with the specified identifier.
     *
     * @example
     * const filter = automod.getFilter("spam-filter");
     */
    public getFilter(id: string): Filter | undefined {
        return this.filters.get(id);
    }

    /**
     * Checks whether a filter is registered with this AutoMod instance.
     *
     * @param id - Unique identifier of the filter.
     *
     * @returns `true` if the filter exists; otherwise, `false`.
     *
     * @example
     * automod.hasFilter("spam-filter");
     */
    public hasFilter(id: string): boolean {
        return this.filters.has(id);
    }

    /**
     * Removes a registered filter from this AutoMod instance.
     *
     * @param id - Unique identifier of the filter to remove.
     *
     * @returns `true` if the filter was successfully removed;
     * otherwise, `false` if no matching filter exists.
     *
     * @example
     * automod.removeFilter("spam-filter");
     */
    public removeFilter(id: string): boolean {
        return this.filters.remove(id);
    }

    /**
     * Removes all registered filters from this AutoMod instance.
     *
     * Leaves the internal filter manager empty.
     *
     * @returns {void}
     *
     * @example
     * automod.clearFilters();
     */
    public clearFilters(): void {
        this.filters.clear();
    }

    /**
     * Retrieves all filters currently registered with this AutoMod instance.
     *
     * @returns An array containing all registered Filter instances.
     *
     * Returns an empty array when no filters are registered.
     *
     * @example
     * const filters = automod.getFilters();
     *
     * @example
     * // Get the number of registered filters.
     * const count = automod.getFilters().length;
     */
    public getFilters(): Filter[] {
        return this.filters.getAll();
    }

    /**
     * Generates normalized variants of a message using the configured
     * obfuscation mappings.
     *
     * Delegates normalization to the internal ObfuscationManager.
     *
     * @param message - Message content to normalize.
     *
     * @returns An array of unique normalized message variants.
     *
     * @remarks
     * Normalization uses the obfuscation mappings configured during
     * AutoMod initialization.
     *
     * The maximum number of generated variants is controlled by
     * the ObfuscationManager implementation.
     *
     * @example
     * const variants = automod.normalize("example");
     */
    public normalize(message: string): string[] {
        return this.obfuscations.normalize(message);
    }

    /**
     * Evaluates a message against all registered filters and generates
     * an automoderation response.
     *
     * Executes message preprocessing, normalization, filter evaluation,
     * severity sorting, and moderation response construction.
     *
     * When matching filters are found, generates a blocked response
     * containing the AutoMod metadata, matching filters, and trigger
     * information.
     *
     * The optional `onBlock` callback is executed after the response
     * has been constructed.
     *
     * @param message - Original message content to evaluate.
     *
     * @param source - Optional metadata describing the source of
     * the message. Included in the response trigger information.
     *
     * @returns An AutoModResponse describing the moderation result.
     *
     * Returns `{ blocked: false }` when:
     * - The AutoMod instance is disabled.
     * - No registered filters match the message.
     *
     * Returns a blocked response when one or more filters match.
     *
     * @remarks
     * Message preprocessing:
     * - Removes zero-width characters.
     * - Replaces consecutive whitespace with a single space.
     * - Trims leading and trailing whitespace.
     *
     * Match processing:
     * - Evaluates the cleaned message against all registered filters.
     * - Sorts matches by severity using {@link severityOrder}.
     * - Places the highest-severity match first.
     * - Includes every match when `matchAll` is `true`.
     * - Includes only the highest-severity match when `matchAll`
     *   is `false`.
     *
     * Trigger information:
     * - `message.raw` contains the cleaned original message.
     * - `message.normalized` contains the first normalized variant,
     *   falling back to the cleaned message when no variant exists.
     * - Additional source metadata is included through the optional
     *   `source` parameter.
     *
     * Callback behavior:
     * - `onBlock` executes only when a blocked response is generated.
     * - The callback receives the completed AutoModResponse.
     * - The callback is not executed when no filters match.
     *
     * @example
     * const result = automod.test("Example message");
     *
     * if (result.blocked) {
     *     console.log(result.matches);
     * }
     *
     * @example
     * // Include additional message source metadata.
     * const result = automod.test("Example message", {
     *     // Source properties depend on the Source type.
     * });
     *
     * @example
     * // Evaluate all matching filters.
     * const automod = new AutoMod({
     *     id: "moderation",
     *     matchAll: true
     * });
     *
     * @example
     * // Execute a callback whenever a message is blocked.
     * const automod = new AutoMod({
     *     id: "moderation",
     *     onBlock(response) {
     *         console.log(response);
     *     }
     * });
     */
    public test(
        message: string,
        source?: Source
    ): AutoModResponse {
        if (!this.enabled) {
            return { blocked: false };
        }

        const cleanedMessage = message
            .replace(/[\u200B-\u200D\uFEFF]/g, "")
            .replace(/\s+/g, " ")
            .trim();

        const normalizedMessages = this.normalize(cleanedMessage);
        const normalizedMessage = normalizedMessages[0] ?? cleanedMessage;

        const matches: FilterMatch[] = this.filters.test(cleanedMessage);

        if (!matches.length) {
            return { blocked: false };
        }

        matches.sort(
            (a, b) =>
                severityOrder.indexOf(b.severity) -
                severityOrder.indexOf(a.severity)
        );

        const response: AutoModResponse = {
            blocked: true,
            automod: {
                id: this.id,
                name: this.name,
                group: this.group
            },
            matches: this.matchAll ? matches : [matches[0]],
            trigger: {
                message: {
                    raw: cleanedMessage,
                    normalized: normalizedMessage
                },
                ...source
            }
        };

        this.onBlock?.(response);

        return response;
    }
}
