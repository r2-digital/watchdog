import { IResourceContainer } from '@watchdog/abstractions';

export type Resolver<T> = (container: IResourceContainer) => T;
