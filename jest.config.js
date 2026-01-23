module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/services"],
  transform: {
    "^.+\\.ts$": ["ts-jest", {
      tsconfig: {
        esModuleInterop: true,
      }
    }],
  },
  moduleNameMapper: {
    "^@shared/logger$": "<rootDir>/shared/logger/index.ts",
  },
  verbose: true,
};
