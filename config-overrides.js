// config-overrides.js
const path = require('path');

module.exports = function override(config) {
  // Add alias for '../services/api' to point to admin side's api.js
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '../services/api': path.resolve(__dirname, '../architect-portfolio-admin/src/services/api'),
    },
  };
  return config;
};