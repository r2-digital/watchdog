import {
    Constructor,
    IAsyncDisposable,
    IResourceDescriptor,
    IResourceMonitor,
    Resolver,
} from '@watchdog/abstractions';
import { ITerminationSignalHandler } from '@watchdog/diagnostics/abstractions';
import { ILogger } from '@watchdog/logging/abstractions';
import { ResourceDescriptor } from '@watchdog/ResourceDescriptor';

export class ResourceMonitor implements IResourceMonitor {
    private _resources: Map<string, IResourceDescriptor<IAsyncDisposable>>;
    private readonly _terminalSignalHandler: ITerminationSignalHandler;
    private readonly _logger?: ILogger;

    public constructor(
        terminalSignalHandler: ITerminationSignalHandler,
        logger?: ILogger,
    ) {
        this._resources = new Map<
            string,
            IResourceDescriptor<IAsyncDisposable>
        >();
        this._terminalSignalHandler = terminalSignalHandler;
        this._terminalSignalHandler.registerHandler(
            this.disposeResource.bind(this),
        );
        this._logger = logger;
    }

    private async disposeResource(): Promise<void> {
        const promises: Array<Promise<void>> = [
            ...this._resources.entries(),
        ].map(
            async ([name, descriptor]: [
                string,
                IResourceDescriptor<IAsyncDisposable>,
            ]): Promise<void> => {
                this._logger?.debug(`Preparing to dispose ${name}`, {
                    resource: name,
                    action: 'disposing',
                });
                await descriptor.resource.disposeAsync();
                this._logger?.debug(`${name} disposed`, {
                    resource: name,
                    action: 'disposed',
                });
            },
        );

        const execution: Array<PromiseSettledResult<Awaited<Promise<void>>>> =
            await Promise.allSettled(promises);

        const failedReasons: Array<string> = execution
            .filter(
                (
                    result:
                        | PromiseFulfilledResult<void>
                        | PromiseRejectedResult,
                ): result is PromiseRejectedResult =>
                    result.status === 'rejected',
            )
            .map((result: PromiseRejectedResult) => String(result.reason));

        if (failedReasons.length) {
            this._logger?.warn('Some resources was not properly disposed', {
                reasons: failedReasons,
            });
        }
    }

    public tryAdd<TResource extends IAsyncDisposable>(
        Resource: Constructor<TResource>,
        resolver?: Resolver<TResource>,
    ): boolean {
        if (this._resources.has(Resource.name)) {
            return false;
        }

        this._resources.set(
            Resource.name,
            ResourceDescriptor.Create(
                (): TResource => (resolver ? resolver(this) : new Resource()),
            ),
        );

        return true;
    }

    public resolveAll(): void {
        this._resources.forEach(
            (
                descriptor: IResourceDescriptor<IAsyncDisposable>,
                name: string,
            ): void => {
                descriptor.resolve();
                this._logger?.debug(`Resource "${name}" resolved`, {
                    resourceName: name,
                });
            },
        );
    }

    public getResource<TResource extends IAsyncDisposable>(
        Resource: Constructor<TResource>,
    ): TResource {
        const descriptor: IResourceDescriptor<IAsyncDisposable> | undefined =
            this._resources.get(Resource.name);

        if (!descriptor) {
            // TODO: create specific error
            throw new Error('Resource not registered');
        }

        return descriptor.resource as TResource;
    }
}
