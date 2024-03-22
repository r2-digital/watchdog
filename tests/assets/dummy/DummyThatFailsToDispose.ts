import { randomUUID } from 'node:crypto';

export class DummyThatFailsToDispose {
    private readonly _argument: string;

    public get argument(): string {
        return this._argument;
    }

    public constructor(argument?: string) {
        this._argument = argument ?? randomUUID();
    }

    public disposeAsync(): Promise<void> {
        return Promise.reject(new Error('I have a bad feeling about this'));
    }
}
