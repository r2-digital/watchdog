import { TerminationSignalHandler } from '@watchdog/diagnostics';
import { ITerminationSignalHandler } from '@watchdog/diagnostics/abstractions';
import { DummyWithTimestamp } from '@test-assets/dummy';
import { randomUUID } from 'node:crypto';

describe('Scenario: TerminationSignalHandler', (): void => {
    describe('Given a TerminationSignalHandler instance', (): void => {
        const termination: DummyWithTimestamp = new DummyWithTimestamp(
            randomUUID(),
        );
        const spyOnDisposeAsync: jest.SpyInstance = jest.spyOn(
            termination,
            'disposeAsync',
        );
        const terminationSignalHandler: ITerminationSignalHandler =
            new TerminationSignalHandler();
        const cases: Array<string> = ['SIGINT', 'SIGTERM'];

        describe('When send signals was sent', (): void => {
            it.each(cases)(
                'Then it should be able to handle %p signal',
                (signal: string) => {
                    terminationSignalHandler.registerHandler(
                        termination.disposeAsync,
                    );
                    process.kill(process.pid, signal);
                    expect(spyOnDisposeAsync).toHaveBeenCalled();
                },
            );
        });
    });
});
