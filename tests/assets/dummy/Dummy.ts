import { randomUUID } from 'node:crypto';
import { IAsyncDisposable } from '@watchdog/abstractions';

export class Dummy implements IAsyncDisposable {
    private readonly _argument: string;

    public get argument(): string {
        return this._argument;
    }

    public constructor(argument?: string) {
        this._argument = argument ?? randomUUID();
    }

    public disposeAsync(): Promise<void> {
        return Promise.resolve();
    }
}
