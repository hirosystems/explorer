module.exports = {
  extends: ['plugin:react-hooks/recommended', 'plugin:@next/next/recommended'],
  plugins: ['react', 'react-hooks'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true,
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
  },
};
