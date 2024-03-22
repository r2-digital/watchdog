import {
    Constructor,
    IAsyncDisposable,
    IResourceContainer,
    Resolver,
} from '@watchdog/abstractions';

/**
 * @interface
 * Represents a resource monitor.
 * Extends {@link IResourceContainer}.
 */
export interface IResourceMonitor extends IResourceContainer {
    /**
     * Tries to add a resource to the monitor.
     * @template TResource - The type of the resource to add.
     * @param {Constructor<TResource>} Resource - The constructor of the resource to add.
     * @param {Resolver<TResource>} [resolver] - The resolver function for the resource (optional).
     * @returns {boolean} True if the resource was successfully added, false otherwise.
     */
    tryAdd<TResource extends IAsyncDisposable>(
        Resource: Constructor<TResource>,
        resolver?: Resolver<TResource>,
    ): boolean;

    /**
     * Resolves all registered resources.
     */
    resolveAll(): void;
}
