import { Callback } from '@watchdog/threading/abstractions';

export interface ITerminationSignalHandler {
    registerHandler(callback: Callback<void, Promise<void>>): void;
}
