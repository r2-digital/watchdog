/**
 * Regular expression for matching local directory patterns related to pay-card-operator.
 * @type {RegExp}
 */
const _localMatcher: RegExp = /(.+)?(watchdog)/;

/**
 * Regular expression for matching CI (Continuous Integration) directory patterns related to build.
 * @type {RegExp}
 */
const _ciMatcher: RegExp = /(.+)?(build)/;

/**
 * Retrieves the root directory path based on the provided current directory and optional matcher.
 *
 * @param {string} currentDir - The current directory path.
 * @param {RegExp} matcher - The regular expression used for matching directory patterns.
 * @returns {string} The root directory path.
 * @throws {Error} Throws an error if unable to determine the root directory when using CI matcher.
 */
export const getRootDirFrom = (
    currentDir: string,
    matcher: RegExp = _localMatcher,
): string => {
    /**
     * Attempt to match the provided directory with the specified matcher.
     * @type {RegExpMatchArray | null}
     */
    const result: RegExpMatchArray | null = currentDir.match(matcher);

    /**
     * If no match is found, and the matcher is the CI matcher, throw an error.
     */
    if (!result || !result.length) {
        if (String(matcher) === String(_ciMatcher)) {
            throw Error('Unable to determine root directory');
        }

        /**
         * If no match is found and the matcher is not the CI matcher, retry with the CI matcher.
         * @type {string}
         */
        return getRootDirFrom(currentDir, _ciMatcher);
    }

    /**
     * Return the first matched group as the root directory path.
     * @type {string}
     */
    return result[0]!;
};
