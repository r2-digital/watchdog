import { randomUUID } from 'node:crypto';
import { DummyWithTimestamp } from '@test-assets/dummy';
import { IResourceDescriptor } from '@watchdog/abstractions';
import { ResourceDescriptor } from '@watchdog/ResourceDescriptor';

describe('Scenario: ResourceDescriptor', (): void => {
    describe('Given an instance of ResourceDescriptor', (): void => {
        describe('When the method resolve() was called', (): void => {
            it('Then it should be able to resolve resource', (): void => {
                const uuid: string = randomUUID();
                const resolver: IResourceDescriptor<DummyWithTimestamp> =
                    ResourceDescriptor.Create(
                        () => new DummyWithTimestamp(uuid),
                    );
                resolver.resolve();

                const { resource }: IResourceDescriptor<DummyWithTimestamp> =
                    resolver;

                expect(resource).not.toBeNull();
                expect(resource).not.toBeUndefined();
                expect(resource.argument).toBe(uuid);
            });
        });

        describe('When the method resolve() was NOT called', (): void => {
            it('Then it should be able to resolve resource anyway', (): void => {
                const uuid: string = randomUUID();
                const resolver: IResourceDescriptor<DummyWithTimestamp> =
                    ResourceDescriptor.Create(
                        () => new DummyWithTimestamp(uuid),
                    );
                const { resource }: IResourceDescriptor<DummyWithTimestamp> =
                    resolver;

                expect(resource).not.toBeNull();
                expect(resource).not.toBeUndefined();
                expect(resource.argument).toBe(uuid);
            });
        });
    });
});
