import { IAsyncDisposable } from '@watchdog/abstractions';

/**
 * @interface
 * Represents a resource descriptor.
 * @template T - The type of the resource extends {@link IAsyncDisposable}.
 */
export interface IResourceDescriptor<T extends IAsyncDisposable> {
    /**
     * The resource object.
     * @template T - The type of the resource extends {@link IAsyncDisposable}.
     * @type {T}
     */
    resource: T;

    /**
     * Resolves the resource.
     * @returns {void}
     */
    resolve(): void;
}
