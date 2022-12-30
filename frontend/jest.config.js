module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.css$": "jest-transform-css",
  },
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  moduleDirectories: ["node_modules"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};
