/**
 * @type
 * Represents a callback function.
 * @template TInput - The type of the input parameter.
 * @template TResult - The type of the result returned by the callback.
 * @returns TResult
 */
export type Callback<TInput, TResult> = (input: TInput) => TResult;
