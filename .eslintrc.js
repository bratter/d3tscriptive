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
    'import/no-unresolved': 'off',
    // Turn off no-any as too restrictive when dealing with d3
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
