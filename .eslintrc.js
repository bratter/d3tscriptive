// See: https://www.npmjs.com/package/eslint-config-airbnb-typescript
// See this for additional ideas: https://github.com/iamturns/create-exposed-app/blob/master/.eslintrc.js

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jest',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base',
    'plugin:jest/recommended',
    'plugin:jest/style',
  ],
  rules: {
    // Allow unresolved for d3 peer dependency and sub-packages
    'import/no-unresolved': 'off',
    // Turn off no-any as too restrictive when dealing with d3
    '@typescript-eslint/no-explicit-any': 'off',
    // Change default export behavior: https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    // Too restrictive
    'class-methods-use-this': 'off',
    // Alter settings to align with the d3tscriptive paradigms
    // TODO: Reconsider these
    'no-return-assign': 'off',
    'no-shadow': 'off',
    'func-names': 'off',
  },
}
