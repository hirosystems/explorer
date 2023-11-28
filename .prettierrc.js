module.exports = {
  ...require('@stacks/prettier-config'),
  plugins: ['@trivago/prettier-plugin-sort-imports'],
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
