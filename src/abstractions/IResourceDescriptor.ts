import { IAsyncDisposable } from '@watchdog/abstractions';

export interface IResourceDescriptor<T extends IAsyncDisposable> {
    resource: T;
    resolve(): void;
}
