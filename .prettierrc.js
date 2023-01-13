module.exports = {
  ...require('@stacks/prettier-config'),
  importOrder: [
    '^@stacks/(.*)$',
    '^@ui/(.*)$',
    '^@common/(.*)$',
    '^@components/(.*)$',
    '^@modules/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
