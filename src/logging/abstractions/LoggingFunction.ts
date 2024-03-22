/**
 * @type
 * Represents a logging function type.
 * @param {string} message - The message to log.
 * @param {unknown[]} [metadata] - Additional metadata to include in the log (optional).
 */
export type LoggingFunction = (message: string, ...meta: unknown[]) => void;
