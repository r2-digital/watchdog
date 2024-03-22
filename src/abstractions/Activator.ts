/**
 * Represents a function type that creates an instance of type `T`.
 * @template T - The type of object to be activated.
 */
export type Activator<T> = () => T;
