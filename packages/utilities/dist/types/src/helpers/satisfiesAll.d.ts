/**
 * Creates a Set and ensures all members of the specified type are included.
 *
 * Provides compile-time checks to prevent missing or invalid values
 * when defining a complete collection of union type members.
 *
 * @example
 * satisfiesAll<"red" | "green" | "blue">()("red", "green", "blue");
 */
export declare const satisfiesAll: <T>() => <U extends T[]>(...array: U & ([T] extends [U[number]] ? ([U[number]] extends [T] ? U : never) : never)) => Set<T>;
