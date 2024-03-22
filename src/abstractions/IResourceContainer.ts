import { Constructor, IAsyncDisposable } from '@watchdog/abstractions';

/**
 * @interface
 * Represents a resource container.
 */
export interface IResourceContainer {
    /**
     * Gets the instance of the specified resource.
     * @template TResource - The type of the resource to retrieve.
     * @param {Constructor<TResource>} Resource - The constructor of the resource to retrieve.
     * @returns {TResource} The instance of the resource.
     * @throws {Error} if the resource is not found.
     */
    getResource<TResource extends IAsyncDisposable>(
        Resource: Constructor<TResource>,
    ): TResource;
}
