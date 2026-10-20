/**
 * Creates a collection of assertion helpers for validating a value's type.
 *
 * Each assertion validates the provided value and returns it with the
 * appropriate TypeScript type. If validation fails, an AdvancedError
 * with error code 1000 is thrown.
 *
 * @param value - The unknown value to validate.
 * @returns An object containing type assertion methods.
 *
 * @example
 * assert("hello").isString();       // string
 * assert(123).isNumber();           // number
 * assert(true).isBoolean();         // boolean
 * assert(null).isNull();            // null
 * assert(undefined).isUndefined();  // undefined
 * assert([1, 2, 3]).isArray();       // unknown[]
 * assert({ id: 1 }).isObject();     // Record<string, unknown>
 *
 * @example
 * try {
 *     assert(123).isString();
 * } catch (error) {
 *     if (error instanceof AdvancedError) {
 *         log.error(error.id);
 *         log.error(error.code);
 *         log.error(error.message);
 *         log.error(error.details);
 *     }
 * }
 */
export default function assert(value: unknown): {
    /**
     * Asserts that the value is a string.
     *
     * @returns The validated string.
     * @throws {AdvancedError} If the value is not a string.
     *
     * @example
     * assert("hello").isString(); // "hello"
     */
    isString(): string;
    /**
     * Asserts that the value is a number and is not NaN.
     *
     * Infinity and -Infinity are accepted.
     *
     * @returns The validated number.
     * @throws {AdvancedError} If the value is not a number or is NaN.
     *
     * @example
     * assert(42).isNumber(); // 42
     */
    isNumber(): number;
    /**
     * Asserts that the value is a finite number.
     *
     * Rejects NaN, Infinity, and -Infinity.
     *
     * @returns The validated finite number.
     * @throws {AdvancedError} If the value is not a finite number.
     *
     * @example
     * assert(42).isFiniteNumber(); // 42
     */
    isFiniteNumber(): number;
    /**
     * Asserts that the value is a boolean.
     *
     * @returns The validated boolean.
     * @throws {AdvancedError} If the value is not a boolean.
     *
     * @example
     * assert(true).isBoolean(); // true
     */
    isBoolean(): boolean;
    /**
     * Asserts that the value is null.
     *
     * @returns null.
     * @throws {AdvancedError} If the value is not null.
     *
     * @example
     * assert(null).isNull(); // null
     */
    isNull(): null;
    /**
     * Asserts that the value is undefined.
     *
     * @returns undefined.
     * @throws {AdvancedError} If the value is not undefined.
     *
     * @example
     * assert(undefined).isUndefined(); // undefined
     */
    isUndefined(): undefined;
    /**
     * Asserts that the value is neither null nor undefined.
     *
     * @returns The validated non-nullish value.
     * @throws {AdvancedError} If the value is null or undefined.
     *
     * @example
     * assert("hello").isDefined(); // "hello"
     */
    isDefined(): NonNullable<typeof value>;
    /**
     * Asserts that the value is an array.
     *
     * Does not validate the array's elements.
     *
     * @returns The validated array.
     * @throws {AdvancedError} If the value is not an array.
     *
     * @example
     * assert([1, 2, 3]).isArray(); // unknown[]
     */
    isArray(): unknown[];
    /**
     * Asserts that the value is an array whose elements pass a validator.
     *
     * The validator's return type determines the resulting element type.
     *
     * @param validator - Validates and returns each element.
     * @returns The validated array with the inferred element type.
     * @throws {AdvancedError} If the value is not an array or an element fails validation.
     *
     * @example
     * assert(["hello", "world"]).isArrayOf(
     *     (item) => assert(item).isString()
     * ); // string[]
     *
     * @example
     * assert([1, 2, 3]).isArrayOf(
     *     (item) => assert(item).isNumber()
     * ); // number[]
     */
    isArrayOf<T>(validator: (item: unknown, index: number) => T): T[];
    /**
     * Asserts that the value is a non-null object and not an array.
     *
     * Class instances and special objects such as Date are accepted.
     *
     * @returns The validated object.
     * @throws {AdvancedError} If the value is null, an array, or not an object.
     *
     * @example
     * assert({ id: 1 }).isObject(); // Record<string, unknown>
     */
    isObject(): Record<string, unknown>;
    /**
     * Asserts that the value is a plain object.
     *
     * A plain object has Object.prototype or null as its prototype.
     * Arrays, null, class instances, and special objects are rejected.
     *
     * @returns The validated plain object.
     * @throws {AdvancedError} If the value is not a plain object.
     *
     * @example
     * assert({ id: 1 }).isPlainObject(); // Record<string, unknown>
     */
    isPlainObject(): Record<string, unknown>;
    /**
     * Asserts that the value is a function.
     *
     * @returns The validated function.
     * @throws {AdvancedError} If the value is not a function.
     *
     * @example
     * assert(() => "hello").isFunction();
     */
    isFunction(): (...args: unknown[]) => unknown;
    /**
     * Asserts that the value is a symbol.
     *
     * @returns The validated symbol.
     * @throws {AdvancedError} If the value is not a symbol.
     *
     * @example
     * assert(Symbol("id")).isSymbol();
     */
    isSymbol(): symbol;
    /**
     * Asserts that the value is a bigint.
     *
     * @returns The validated bigint.
     * @throws {AdvancedError} If the value is not a bigint.
     *
     * @example
     * assert(123n).isBigInt(); // 123n
     */
    isBigInt(): bigint;
    /**
     * Asserts that the value is a valid Date object.
     *
     * Invalid dates are rejected.
     *
     * @returns The validated Date.
     * @throws {AdvancedError} If the value is not a valid Date.
     *
     * @example
     * assert(new Date()).isDate();
     */
    isDate(): Date;
    /**
     * Asserts that the value is an instance of a specified class.
     *
     * @param constructor - The class constructor to check against.
     * @returns The validated class instance.
     * @throws {AdvancedError} If the value is not an instance of the specified class.
     *
     * @example
     * assert(new Date()).isInstanceOf(Date); // Date
     *
     * @example
     * class User {}
     * assert(new User()).isInstanceOf(User); // User
     */
    isInstanceOf<T>(constructor: new (...args: unknown[]) => T): T;
    /**
     * Asserts that the value is a string containing valid JSON.
     *
     * Returns the original string rather than the parsed value.
     *
     * @returns The validated JSON string.
     * @throws {AdvancedError} If the value is not a string or contains invalid JSON.
     *
     * @example
     * assert('{"id":1}').isJSON(); // '{"id":1}'
     * assert("[1,2,3]").isJSON();  // "[1,2,3]"
     */
    isJSON(): string;
    /**
     * Asserts that the value can be serialized as JSON.
     *
     * Checks whether JSON.stringify produces a string without throwing.
     * Note that serialization can omit or transform certain values.
     *
     * @returns The original value.
     * @throws {AdvancedError} If serialization fails or produces undefined.
     *
     * @example
     * assert({ id: 1 }).isJSONSerializable();
     * assert([1, 2, 3]).isJSONSerializable();
     */
    isJSONSerializable(): typeof value;
    /**
     * Asserts that the value is an empty or whitespace-only string.
     *
     * @returns The validated string.
     * @throws {AdvancedError} If the value is not an empty or whitespace-only string.
     *
     * @example
     * assert("").isEmptyString();   // ""
     * assert("   ").isEmptyString(); // "   "
     */
    isEmptyString(): string;
    /**
     * Asserts that the value is a non-empty string.
     *
     * Whitespace-only strings are rejected.
     *
     * @returns The validated string.
     * @throws {AdvancedError} If the value is not a non-empty string.
     *
     * @example
     * assert("hello").isNonEmptyString(); // "hello"
     */
    isNonEmptyString(): string;
};
