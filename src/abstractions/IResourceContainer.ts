import { Constructor, IAsyncDisposable } from '@watchdog/abstractions';

export interface IResourceContainer {
    getResource<TResource extends IAsyncDisposable>(
        Resource: Constructor<TResource>,
    ): TResource;
}
