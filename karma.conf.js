module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      'src/**/*.ts',
      { pattern: 'test/**/*.ts' },
    ],
    preprocessors: {
      '**/*.ts': 'karma-typescript'
    },
    reporters: ['progress', 'karma-typescript'],
    browsers: ['Chrome'],
    karmaTypescriptConfig: {
      coverageOptions: {
        exclude: [
          /\.(d|spec|test)\.ts/i,
          /^test[\/\\].+/i,
        ],
      },
      reports: {
        'html': 'coverage',
        'text': '',
      },
    },
  })
}
