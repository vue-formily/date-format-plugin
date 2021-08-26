module.exports = {
  preset: 'ts-jest',
  rootDir: __dirname,
  testMatch: ['<rootDir>/tests/**/*spec.[jt]s?(x)'],
  collectCoverageFrom: ['src/*.ts'],
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
