const ts = require('@rollup/plugin-typescript');
const replace = require('@rollup/plugin-replace');
const { babel } = require('@rollup/plugin-babel');

/**
 * bundle prod
 */
const { defineConfig } = require('rollup');

module.exports = defineConfig([
  {
    input: './src/index.ts',
    output: {
      format: 'iife',
      file: './dist/index.iife-es6.js',
      sourcemap: true,
      generatedCode: 'es2015',
    },
    plugins: [
      ts(),
      replace({
        preventAssignment: true,
        __ES6__: JSON.stringify(true),
      }),
    ],
  },
  {
    input: './src/index.ts',
    output: {
      format: 'iife',
      file: './dist/index.iife-es5.js',
      sourcemap: true,
    },
    plugins: [
      ts(),
      babel({
        babelHelpers: 'bundled',
        presets: [
          [
            '@babel/preset-env',
            {
              loose: true,
            },
          ],
        ],
        extensions: ['.ts', '.js']
      }),
      replace({
        preventAssignment: true,
        __ES6__: JSON.stringify(false),
      }),
    ],
  },
]);
