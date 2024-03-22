import {
    Constructor,
    IAsyncDisposable,
    IResourceContainer,
    Resolver,
} from '@watchdog/abstractions';

export interface IResourceMonitor extends IResourceContainer {
    tryAdd<TResource extends IAsyncDisposable>(
        Resource: Constructor<TResource>,
        resolver?: Resolver<TResource>,
    ): boolean;

    resolveAll(): void;
}
