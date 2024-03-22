import { Callback } from '@watchdog/threading/abstractions';

/**
 * @interface
 * Represents a termination signal handler.
 */
export interface ITerminationSignalHandler {
    /**
     * Registers a callback function to handle termination signals.
     * @param {Callback<void, Promise<void>>} callback - The callback function to handle termination signals.
     * @returns {void}
     */
    registerHandler(callback: Callback<void, Promise<void>>): void;
}
