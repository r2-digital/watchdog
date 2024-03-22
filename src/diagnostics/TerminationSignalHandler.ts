import { ITerminationSignalHandler } from '@watchdog/diagnostics/abstractions';
import { ExitCode } from '@watchdog/diagnostics/ExitCode';
import { ILogger } from '@watchdog/logging/abstractions';
import { Callback } from '@watchdog/threading/abstractions';

export class TerminationSignalHandler implements ITerminationSignalHandler {
    private readonly _logger?: ILogger;
    private readonly _signals: Array<NodeJS.Signals>;

    public constructor(logger?: ILogger) {
        this._logger = logger;
        /**
         * AWS Elastic Container Service triggers SIGTERM, wait 30s, then SIGKILL.
         * SIGINT is not triggered, but we'll use it here for dev/local context.
         *
         * @see {@link https://aws.amazon.com/pt/blogs/containers/graceful-shutdowns-with-ecs/}
         */
        this._signals = ['SIGINT', 'SIGTERM'];
        this.removeAllListeners();
    }

    private removeAllListeners(): void {
        this._signals.forEach((signal: NodeJS.Signals): void => {
            process.removeAllListeners(signal as string);
        });
        this._logger?.debug('All termination signals handlers removed');
    }

    private getExitCodeBySignal(signal: NodeJS.Signals): ExitCode {
        return signal === 'SIGTERM' ? ExitCode.Termination : ExitCode.Interrupt;
    }

    public registerHandler(callback: Callback<void, Promise<void>>): void {
        this._signals.forEach((signal: NodeJS.Signals): void => {
            process.once(signal as string, (): void => {
                this._logger?.info(
                    `Received termination signal. Intercepting ${signal}`,
                    {
                        signal,
                    },
                );
                callback().then(() =>
                    process.exit(this.getExitCodeBySignal(signal)),
                );
            });
            this._logger?.debug(`Handler registered for signal. (${signal})`, {
                signal,
            });
        });
    }
}
