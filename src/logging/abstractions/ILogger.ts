/**
 * @interface
 * Represents an interface for a logger.
 */
export interface ILogger {
    /**
     * Logs a debug message.
     * @template T - The type of metadata.
     * @param {string} message - The debug message to log.
     * @param {T} [metadata] - Additional metadata to include in the log (optional).
     */
    debug<T>(message: string, metadata?: T): void;

    /**
     * Logs an informational message.
     * @template T - The type of metadata.
     * @param {string} message - The informational message to log.
     * @param {T} [metadata] - Additional metadata to include in the log (optional).
     */
    info<T>(message: string, metadata?: T): void;

    /**
     * Logs a warning message.
     * @template T - The type of metadata.
     * @param {string} message - The warning message to log.
     * @param {T} [metadata] - Additional metadata to include in the log (optional).
     */
    warn<T>(message: string, metadata?: T): void;

    /**
     * Logs an error message.
     * @template T - The type of metadata.
     * @param {string} message - The error message to log.
     * @param {T} [metadata] - Additional metadata to include in the log (optional).
     */
    error<T>(message: string, metadata?: T): void;

    /**
     * Creates a child logger with additional metadata.
     * @template T - The type of metadata.
     * @param {T} metadata - The additional metadata to include in the child logger.
     * @returns {ILogger} A new child logger.
     */
    child<T extends NonNullable<unknown>>(metadata: T): ILogger;
}
