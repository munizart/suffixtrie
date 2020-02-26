module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true
  },
  plugins: ['@typescript-eslint'],
  extends: ['standard', 'plugin:@typescript-eslint/eslint-recommended'],
  rules: {
    'no-undef': 'off',
    'no-unused-vars': 'off'
  }
}
