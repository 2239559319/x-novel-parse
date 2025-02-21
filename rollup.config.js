/**
 * bundle prod
 */

const ts = require('@rollup/plugin-typescript');
const replace = require('@rollup/plugin-replace');
const { babel } = require('@rollup/plugin-babel');
const terser = require('@rollup/plugin-terser');

function createConfig(format) {
  const input = format === 'iife' ? './src/iife.ts' : './src/index.ts';
  const sourcemap = format === 'iife' ? 'inline' : false;

  const config = [
    {
      input,
      output: {
        format,
        file: `./dist/${format}/index-es6.js`,
        sourcemap,
        generatedCode: 'es2015',
      },
      plugins: [
        ts(),
        replace({
          preventAssignment: true,
          __ES6__: JSON.stringify(true),
          __DEV__: JSON.stringify(false),
          'Node.TEXT_NODE': JSON.stringify(3),
          'Node.ELEMENT_NODE': JSON.stringify(1)

        }),
        format === 'esm' ? terser() : null,
      ].filter((v) => !!v),
    },
    {
      input,
      output: {
        format,
        file: `./dist/${format}/index-es5.js`,
        sourcemap,
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
          extensions: ['.ts', '.js'],
        }),
        replace({
          preventAssignment: true,
          __ES6__: JSON.stringify(false),
          __DEV__: JSON.stringify(false),
        }),
        format === 'esm' ? terser() : null,
      ].filter((v) => !!v),
    },
  ];
  return config;
}

module.exports = [
  ...createConfig('iife'),
  ...createConfig('esm'),
  ...createConfig('cjs'),
];
