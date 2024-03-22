#!/bin/bash -e

unset TZ
unset NODE_ENV

unset DIST
unset SOURCE
unset TESTS
unset COVERAGE
unset BASE_PATH
unset DIST_PATH
unset COVERAGE_PATH
unset TSCONFIG
unset TSCONFIG_BUILD
unset ENTRYPOINT
unset JEST
unset DEPCHECK_RC

unset ARGUMENT_LIST
unset LONG_OPTS
unset OPTS

DIST=dist
SOURCE=src
TESTS=tests
COVERAGE=coverage
BASE_PATH="$(dirname "$0")"
DIST_PATH="${BASE_PATH}/${DIST}"
COVERAGE_PATH="${BASE_PATH}/${COVERAGE}"
TSCONFIG="${BASE_PATH}/tsconfig.json"
TSCONFIG_BUILD="${BASE_PATH}/tsconfig.build.json"
ENTRYPOINT="${BASE_PATH}/${SOURCE}/index.ts"
JEST="${BASE_PATH}/node_modules/jest/bin/jest.js"
DEPCHECK_RC="${BASE_PATH}/.depcheckrc"

ARGUMENT_LIST=(
    "audit-deps"
    "build"
    "clean"
    "depcheck"
    "lint"
    "prepare"
    "pre-commit"
    "test"
    "usage"
)
LONG_OPTS=$(printf ",%s" "${ARGUMENT_LIST[@]}")
OPTS=$(getopt \
  --longoptions "$(printf "%s," "${LONG_OPTS:1}")" \
  --name "${BASE_PATH}" \
  --options "" \
  -- "$@"
)

execute_audit() {
    pnpm audit --prod --audit-level="high"
}

execute_build() {
    execute_clean
    tsc -p "$TSCONFIG" && tsc-alias -p "$TSCONFIG"
}

execute_clean_dist() {
    rimraf "${DIST_PATH}"
}

execute_clean_coverage() {
    rimraf "${COVERAGE_PATH}"
}

execute_clean() {
    execute_clean_dist
    execute_clean_coverage
}

execute_depcheck() {
    depcheck --config="$DEPCHECK_RC"
}

execute_jest() {
    # shellcheck disable=SC2086
    node --expose-gc "$JEST" --runInBand $1
}

execute_lint() {
    eslint --fix "$BASE_PATH"
}

execute_test() {
    execute_jest  "--projects ${BASE_PATH}/${TESTS}"
}


execute_usage() {
    echo ""
    echo "Usage:  $0 [OPTIONS]"
    echo ""
    echo "Provide a handler for common package.json actions"
    echo ""
    echo "Options:"
    echo "  --audit-deps                execute packages audition"
    echo "  --build                     builds application"
    echo "  --clean                     cleans: ${DIST_PATH} and ${COVERAGE_PATH}"
    echo "  --depcheck                  analyzing the dependencies in a project to see: how each dependency is used"
    echo "  --lint                      check all lint rules and fixes it"
    echo "  --prepare                   execute initial preparation commands"
    echo "  --pre-commit                execute pre-commit script"
    echo "  --test                      execute all tests"
    echo ""
}

eval set --"$OPTS"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --audit-deps)
            execute_audit
            #shift 2
            break
        ;;

        --build)
            execute_build
            #shift 2
            break
        ;;

        --clean)
            execute_clean
            #shift 2
            break
        ;;

        --depcheck)
            execute_depcheck
            #shift 2
            break
        ;;

        --lint)
            execute_lint
            #shift 2
            break
        ;;

        --prepare)
            husky install
            husky set .husky/pre-commit 'pnpm pre-commit'
            #shift 2
            break
        ;;

        --pre-commit)
            export TZ=UTC
            export NODE_ENV=development
            execute_audit
            execute_lint
            execute_depcheck
            execute_build
            execute_test
            #shift 2
            break
        ;;

        --test)
            export TZ=UTC
            export NODE_ENV=development
            execute_test
            #shift 2
            break
        ;;

        --usage)
            execute_usage
            break
        ;;

        *)
            execute_usage
            break
        ;;
    esac
done
