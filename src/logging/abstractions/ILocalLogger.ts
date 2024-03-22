import { ILogger } from '@watchdog/logging/abstractions';

export interface ILocalLogger extends ILogger {
    childLocal<T extends NonNullable<unknown>>(metadata: T): ILogger;
}
