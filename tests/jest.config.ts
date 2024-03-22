import { Config } from 'jest';
import { getRootDirFrom } from './jest.utils';

const rootDir: string = getRootDirFrom(__dirname);
const testTimeout: number = 1000 * 60;

export default async (): Promise<Config> => ({
    rootDir,
    testTimeout,
    preset: 'ts-jest',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    displayName: {
        name: 'unit-tests',
        color: 'blue',
    },
    testEnvironment: 'node',
    maxWorkers: 1,
    maxConcurrency: 1,
    showSeed: true,
    clearMocks: true,
    detectOpenHandles: true,
    forceExit: true,
    logHeapUsage: true,
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['clover', 'json', 'lcov', 'text'],
    coveragePathIgnorePatterns: [
        '/types/',
        'types.ts',
        'index.ts',
        'startup.ts',
        '.+.d.ts',
        '.+.types.ts',
        'enums.ts',
    ],
    testMatch: ['<rootDir>/tests/**/*[tT]est.ts'],
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
    moduleNameMapper: {
        '^@watchdog/(.*)$': '<rootDir>/src/$1',
        '^@test-assets/(.*)$': '<rootDir>/tests/assets/$1',
    },
});
