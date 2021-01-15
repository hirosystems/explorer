// lint-staged.config.js
module.exports = {
  '**/*.ts?(x)': () => 'yarn lint:prettier && yarn typecheck',
};
