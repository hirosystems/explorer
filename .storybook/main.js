const path = require('path');
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
    disableTelemetry: true,
  },
  webpackFinal: async config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ui': path.resolve(__dirname, '../src/ui'),
      '@store': path.resolve(__dirname, '../src/store'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@features': path.resolve(__dirname, '../src/features'),
      '@pages': path.resolve(__dirname, '../src/pages'),
      '@common': path.resolve(__dirname, '../src/common'),
      '@models': path.resolve(__dirname, '../src/models'),
      '@sandbox': path.resolve(__dirname, '../src/sandbox'),
      '@modules': path.resolve(__dirname, '../src/modules'),
    };
    return config;
  },
};
