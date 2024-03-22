import { IResourceContainer } from '@watchdog/abstractions';

/**
 * Represents a function type that resolves a dependency from a resource container.
 * @template T - The type of object to be resolved.
 * @param {IResourceContainer} container - The resource container from which to resolve the dependency.
 * @returns {T} - The object resolved.
 */
export type Resolver<T> = (container: IResourceContainer) => T;
