/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/", "<rootDir>/tests/"],
  testMatch: ["**/*.test.ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/index.ts",
    "!src/config/swagger.ts",
    "!**/node_modules/**"
  ],
  coverageDirectory: "coverage",
  setupFiles: ["./jest/setEnvVars.js"],
  verbose: true
}; 