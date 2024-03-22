import { randomUUID } from 'node:crypto';
import process from 'node:process';
import { IResourceMonitor } from '@watchdog/abstractions';
import { ITerminationSignalHandler } from '@watchdog/diagnostics/abstractions';
import { TerminationSignalHandler } from '@watchdog/diagnostics';
import {
    Dummy,
    DummyThatFailsToDispose,
    DummyWithTimestamp,
} from '@test-assets/dummy';
import { ResourceMonitor } from '@watchdog/ResourceMonitor';

describe('Scenario: ResourceMonitor', (): void => {
    describe('Given a ResourceMonitor instance ', (): void => {
        const uuid: string = randomUUID();

        const executeBasicAsserts = (monitor: IResourceMonitor): void => {
            const resource: Dummy = monitor.getResource(Dummy);

            expect(resource).not.toBeNull();
            expect(resource).not.toBeUndefined();
            expect(resource).toBe(monitor.getResource(Dummy));
        };

        describe('When register a class', (): void => {
            it('Then it should be able to resolve the class using default resolver', (): void => {
                const terminationSignalHandler: ITerminationSignalHandler =
                    new TerminationSignalHandler();
                const monitor: IResourceMonitor = new ResourceMonitor(
                    terminationSignalHandler,
                );
                monitor.tryAdd(Dummy);
                monitor.resolveAll();
                executeBasicAsserts(monitor);
            });

            it('Then it should be able to resolve the class using custom resolver', (): void => {
                const terminationSignalHandler: ITerminationSignalHandler =
                    new TerminationSignalHandler();
                const monitor: IResourceMonitor = new ResourceMonitor(
                    terminationSignalHandler,
                );
                monitor.tryAdd(Dummy, () => new Dummy(uuid));
                monitor.resolveAll();
                executeBasicAsserts(monitor);
            });

            it('Then it should NOT be able to resolve a class that was not previously registered', (): void => {
                const terminationSignalHandler: ITerminationSignalHandler =
                    new TerminationSignalHandler();
                const monitor: IResourceMonitor = new ResourceMonitor(
                    terminationSignalHandler,
                );
                monitor.tryAdd(Dummy, () => new Dummy(uuid));
                monitor.resolveAll();
                expect(() => monitor.getResource(DummyWithTimestamp)).toThrow();
            });

            it('Then it should not add same class twice into monitor', (): void => {
                const terminationSignalHandler: ITerminationSignalHandler =
                    new TerminationSignalHandler();
                const monitor: IResourceMonitor = new ResourceMonitor(
                    terminationSignalHandler,
                );

                expect(monitor.tryAdd(Dummy)).toBe(true);
                expect(monitor.tryAdd(Dummy)).toBe(false);
            });

            it('Then it should be able to dispose the registered class', (): void => {
                const terminationSignalHandler: ITerminationSignalHandler =
                    new TerminationSignalHandler();
                const monitor: IResourceMonitor = new ResourceMonitor(
                    terminationSignalHandler,
                );
                monitor.tryAdd(Dummy);
                monitor.resolveAll();

                executeBasicAsserts(monitor);

                const spyOnDisposeAsync: jest.SpyInstance = jest.spyOn(
                    monitor.getResource(Dummy),
                    'disposeAsync',
                );

                process.kill(process.pid, 'SIGTERM');

                expect(spyOnDisposeAsync).toHaveBeenCalled();
            });

            it('Then it should not thrown if some of its resources fail to dispose', (): void => {
                const terminationSignalHandler: ITerminationSignalHandler =
                    new TerminationSignalHandler();
                const monitor: IResourceMonitor = new ResourceMonitor(
                    terminationSignalHandler,
                );
                monitor.tryAdd(DummyThatFailsToDispose);
                monitor.resolveAll();
                const spyOnDisposeAsync: jest.SpyInstance = jest.spyOn(
                    monitor.getResource(DummyThatFailsToDispose),
                    'disposeAsync',
                );
                process.kill(process.pid, 'SIGTERM');
                expect(spyOnDisposeAsync).toHaveBeenCalled();
            });
        });
    });
});
