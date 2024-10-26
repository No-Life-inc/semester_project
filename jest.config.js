export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-node',
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  setupFiles: ['dotenv/config'],
  testMatch: ['<rootDir>/backend/test/**/*.[jt]s?(x)'],
};