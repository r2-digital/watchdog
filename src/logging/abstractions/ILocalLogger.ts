import { ILogger } from '@watchdog/logging/abstractions';

/**
 * @interface
 * Represents an interface for a local logger.
 * Extends {@link ILogger}.
 */
export interface ILocalLogger extends ILogger {
    /**
     * Creates a child local logger with additional metadata.
     * @template T - The type of the additional metadata.
     * @param {T} metadata - The additional metadata to include in the child logger.
     * @returns {ILogger} A new child local logger.
     */
    childLocal<T extends NonNullable<unknown>>(metadata: T): ILogger;
}
