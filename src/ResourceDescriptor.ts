import { IAsyncDisposable } from '@watchdog/abstractions/IAsyncDisposable';
import { IResourceDescriptor } from '@watchdog/abstractions/IResourceDescriptor';
import { Activator } from '@watchdog/abstractions/Activator';

export class ResourceDescriptor<T extends IAsyncDisposable>
    implements IResourceDescriptor<T>
{
    private readonly _activator: Activator<T>;
    private _instance: T | undefined;

    public get resource(): T {
        if (!this._instance) {
            this.resolve();
        }
        return this._instance!;
    }

    private constructor(activator: Activator<T>) {
        this._activator = activator;
    }

    public resolve(): void {
        this._instance = this._activator();
    }

    public static Create<TResource extends IAsyncDisposable>(
        activator: Activator<TResource>,
    ): IResourceDescriptor<TResource> {
        return new ResourceDescriptor(activator);
    }
}
