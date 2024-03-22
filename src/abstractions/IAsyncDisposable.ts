/**
 * @interface
 * Represents a wat for asynchronous disposable objects.
 */
export interface IAsyncDisposable {
    /**
     * Asynchronously disposes the object.
     * @returns {Promise<void>} A Promise that resolves when disposal is complete.
     */
    disposeAsync(): Promise<void>;
}
