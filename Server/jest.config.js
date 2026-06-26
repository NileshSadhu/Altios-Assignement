/** @type {import('jest').Config} */
const config = {
    preset: "ts-jest/presets/default-esm",
    silent: true,
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts"],
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    transform: {
        "^.+\\.ts$": [
            "ts-jest",
            {
                useESM: true,
            },
        ],
    },
};

export default config;