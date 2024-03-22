/**
 * Represents a constructor function type that creates an instance of type `T`.
 * @template T - The type of object to be constructed.
 * @returns {T} - The object constructed.
 */
export type Constructor<T> = new (...args: never[]) => T;
