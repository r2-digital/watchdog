import { ExitCode } from '@watchdog/diagnostics';

describe('Scenario: ExitCode', (): void => {
    describe('Given the ExitCode enumeration', (): void => {
        describe('When some property was called', (): void => {
            it('Then it should deliver correct values', (): void => {
                expect(ExitCode.Interrupt).toBe(130);
                expect(ExitCode.Termination).toBe(143);
            });
        });
    });
});
