/**
 * @enum
 * Enum representing exit codes for different termination signals.
 * @see https://linuxconfig.org/list-of-exit-codes-on-linux
 * @enum {number}
 */
export enum ExitCode {
    /**
     * Exit code when the process is terminated with signal 2 (SIGINT) (ctrl+c on keyboard). 128+2.
     * @type {number}
     */
    Interrupt = 130,

    /**
     * Exit code when the process is terminated with signal 15 (SIGTERM) (kill command). 128+15.
     * @type {number}
     */
    Termination = 143,
}
