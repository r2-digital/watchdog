import { ProcessListener } from '@test-assets/node/process/abstractions';

export const processEventMap: Map<string, (...args: unknown[]) => void> =
    new Map<string, (...args: unknown[]) => void>();

process.removeAllListeners = (
    event: string | symbol | undefined,
): NodeJS.Process => {
    if (!event) {
        processEventMap.clear();
    }
    processEventMap.delete(String(event));
    return process;
};

process.once = (
    event: string | symbol,
    listener: ProcessListener,
): NodeJS.Process => {
    processEventMap.set(String(event), listener);
    return process;
};

process.kill = jest.fn(
    (_pid: number, signal: string | NodeJS.Signals): true => {
        processEventMap.get(String(signal))?.();
        return true;
    },
);

process.exit = jest.fn((_code?: number | undefined): void => {}) as unknown as (
    code?: number | undefined,
) => never;
