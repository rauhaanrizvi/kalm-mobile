const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  devServer: {
      host: '0.0.0.0',
      allowedHosts: 'all',
  },
  return config;
};
