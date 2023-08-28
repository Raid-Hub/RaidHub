/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

require("dotenv").config()

module.exports = {
    preset: "ts-jest",
    coverageProvider: "v8",
    testEnvironment: "node",
    tsConfig: "tsconfig.test.json",
    testMatch: ["**/*.test.ts"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.jsx?$": "babel-jest"
    },
    setupFiles: ["dotenv/config"]
}
