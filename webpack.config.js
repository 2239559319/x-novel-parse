const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
require('dotenv').config();

function getDomain() {
  const _url = process.env.CATALOG_URL;
  const url = new URL(_url);
  return url.origin;
}

const domain = getDomain();

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  mode: 'development',
  entry: {
    index: './src/index.ts',
    dev: './dev/entry.js',
  },
  output: {
    filename: '[name].js',
    path: join(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  performance: {
    maxAssetSize: 50000000,
    maxEntrypointSize: 5000000,
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: 'ts-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: join(__dirname, './dev/index.html'),
      inject: 'body',
      excludeChunks: ['index']
    }),
    new DefinePlugin({
      __DOMAIN__: JSON.stringify(domain),
      __CATALOG_URL__: JSON.stringify(process.env.CATALOG_URL),
      __ES6__: JSON.stringify(true),
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    port: 9999,
    proxy: [
      {
        context: ['/'],
        target: domain,
        changeOrigin: true,
      },
    ],
  },
};

module.exports = config;
