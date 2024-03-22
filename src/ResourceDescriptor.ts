import {
    IAsyncDisposable,
    IResourceDescriptor,
    Activator,
} from '@watchdog/abstractions';

/**
 * @class
 * Represents a resource descriptor. Implements {@link IResourceDescriptor}.
 * @template T - The type of the resource extends {@link IAsyncDisposable}.
 */
export class ResourceDescriptor<T extends IAsyncDisposable>
    implements IResourceDescriptor<T>
{
    private readonly _activator: Activator<T>;
    private _instance: T | undefined;

    /**
     * The resource object.
     * @template T - The type of the resource extends {@link IAsyncDisposable}.
     * @type {T}
     */
    public get resource(): T {
        if (!this._instance) {
            this.resolve();
        }
        return this._instance!;
    }

    /**
     * Creates an instance of {@link ResourceDescriptor}.
     * @param {Activator<T>} activator - The activator function to create the resource.
     */
    private constructor(activator: Activator<T>) {
        this._activator = activator;
    }

    /**
     * Resolves the resource.
     * @returns {void}
     */
    public resolve(): void {
        this._instance = this._activator();
    }

    /**
     * Creates an instance of {@link ResourceDescriptor}.
     * @template TResource - The type of the resource extends {@link IAsyncDisposable}.
     * @param {Activator<TResource>} activator - The activator function to create the resource.
     * @returns {IResourceDescriptor<TResource>} A new instance of ResourceDescriptor.
     */
    public static Create<TResource extends IAsyncDisposable>(
        activator: Activator<TResource>,
    ): IResourceDescriptor<TResource> {
        return new ResourceDescriptor(activator);
    }
}
