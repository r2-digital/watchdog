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

/**
 * @class
 * Represents a resource monitor. Implements {@link IResourceMonitor}.
 */
export class ResourceMonitor implements IResourceMonitor {
    private _resources: Map<string, IResourceDescriptor<IAsyncDisposable>>;
    private readonly _terminalSignalHandler: ITerminationSignalHandler;
    private readonly _logger?: ILogger;

    /**
     * Creates an instance of {@link ResourceMonitor}.
     * @param {ITerminationSignalHandler} terminalSignalHandler - The terminal signal handler to use.
     * @param {ILogger} [logger] - The logger to use for logging (optional).
     */
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

    /**
     * Asynchronously disposes resources when termination signal is received.
     * @returns {Promise<void>}
     */
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

    /**
     * Tries to add a resource to the monitor.
     * @template TResource - The type of the resource extends {@link IAsyncDisposable}.
     * @param {Constructor<TResource>} Resource - The constructor of the resource to add.
     * @param {Resolver<TResource>} [resolver] - The resolver function for the resource (optional).
     * @returns {boolean} True if the resource was successfully added, false otherwise.
     */
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

    /**
     * Resolves all registered resources.
     * @returns {void}
     */
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

    /**
     * Gets the instance of the specified resource.
     * @template TResource - The type of the resource to retrieve.
     * @param {Constructor<TResource>} Resource - The constructor of the resource to retrieve.
     * @returns {TResource} The instance of the resource.
     * @throws {Error} if the resource is not found.
     */
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
