const baseConfig = require('../../percy.base_config.cjs');

module.exports = {
  ...baseConfig,
  storybook: {
    exclude: [
      ...baseConfig.storybook.exclude,
      // Add specific dialtone-vue 2 stories to exclude
    ],
  },
};
