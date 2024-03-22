export interface ILogger {
    debug<T>(message: string, metadata?: T): void;
    info<T>(message: string, metadata?: T): void;
    warn<T>(message: string, metadata?: T): void;
    error<T>(message: string, metadata?: T): void;
    child<T extends NonNullable<unknown>>(metadata: T): ILogger;
}
