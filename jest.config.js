module.exports = {
  testEnvironment: 'node',
  testURL: 'http://localhost',
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  testPathIgnorePatterns: ["/node_modules/", "dist"]
}
