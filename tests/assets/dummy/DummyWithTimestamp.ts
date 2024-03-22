import { IAsyncDisposable } from '@watchdog/abstractions';
import { randomUUID } from 'node:crypto';

export class DummyWithTimestamp implements IAsyncDisposable {
    private readonly _timestamp: Date;
    private readonly _argument: string;

    public get argument(): string {
        return this._argument;
    }

    public constructor(argument?: string) {
        this._timestamp = new Date();
        this._argument = argument ?? randomUUID();
    }

    public getTimestamp(): Date {
        return this._timestamp;
    }

    public disposeAsync(): Promise<void> {
        return Promise.resolve();
    }
}
