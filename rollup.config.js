/**
 * bundle prod
 */

const ts = require('@rollup/plugin-typescript');
const replace = require('@rollup/plugin-replace');
const { babel } = require('@rollup/plugin-babel');
const { defineConfig } = require('rollup');

function createConfig(format) {

  const input = format === 'iife' ? './src/iife.ts' : './src/index.ts';

  const config = [
    {
      input,
      output: {
        format,
        file: `./dist/${format}/index-es6.js`,
        sourcemap: true,
        generatedCode: 'es2015',
      },
      plugins: [
        ts(),
        replace({
          preventAssignment: true,
          __ES6__: JSON.stringify(true),
          __DEV__: JSON.stringify(false),
        }),
      ],
    },
    {
      input,
      output: {
        format,
        file: `./dist/${format}/index-es5.js`,
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
          __DEV__: JSON.stringify(false),
        }),
      ],
    },
  ];
  return config;
}


module.exports = [
  ...createConfig('iife'),
  ...createConfig('esm'),
  ...createConfig('cjs'),
];
