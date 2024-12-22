const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin, BannerPlugin } = require('webpack');
require('dotenv').config();

function getDomain() {
  const _url = process.env.DEBUG_URL;
  const url = new URL(_url);
  return url.origin;
}

const domain = getDomain();

const DEBUG_URLWithQuate = JSON.stringify(process.env.DEBUG_URL);

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  mode: 'development',
  entry: {
    index: './src/iife.ts',
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
    }),
    new DefinePlugin({
      __DOMAIN__: JSON.stringify(domain),
      __DEBUG_URL__: DEBUG_URLWithQuate,
      __ES6__: JSON.stringify(true),
      __DEV__: JSON.stringify(true),
    }),
    new BannerPlugin({
      banner: `(function(location) {
        (() => {
          const base = document.createElement('base');
          base.href = ${DEBUG_URLWithQuate};
          document.head.appendChild(base);
          window.DEBUG_URL = ${DEBUG_URLWithQuate};
        })();
      `,
      raw: true,
      entryOnly: true,
    }),
    new BannerPlugin({
      banner: `})(new URL(${JSON.stringify(process.env.DEBUG_URL)}));`,
      raw: true,
      entryOnly: true,
      footer: true,
    }),
  ],
  devtool: 'source-map',
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
