module.exports = {
  ...require('@stacks/prettier-config'),
  importOrder: [
    '^@stacks/(.*)$',
    '^@common/(.*)$',
    '^@components/(.*)$',
    '^@modules/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
