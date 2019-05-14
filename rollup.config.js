import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

const deps = Object.keys(pkg.dependencies || {});
const peers = Object.keys(pkg.peerDependencies || {});
const allExternal = [...deps, ...peers];

const makeExternalPredicate = externalsArr => {
  if (externalsArr.length === 0) {
    return () => false;
  }
  const externalPattern = new RegExp(`^(${externalsArr.join('|')})($|/)`);
  return id => externalPattern.test(id);
};

const makeBabelConfig = ({ useCoreJS = false, useESModules = true }) => ({
  babelrc: false,
  configFile: false,
  exclude: /node_modules\/(?!callbag-)/,
  extensions: ['.js', '.ts'],
  plugins: [['@babel/plugin-transform-runtime', { useESModules }]],
  runtimeHelpers: true,
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        modules: false,
        ...(useCoreJS ? { useBuiltIns: 'usage', corejs: 3 } : {})
      }
    ]
  ]
});

const createConfig = ({ output, min = false, external = 'all', env }) => ({
  input: './src/index.ts',
  output,
  external: makeExternalPredicate(external === 'all' ? allExternal : peers),
  plugins: [
    resolve(),
    commonjs({ include: 'node_modules/**' }),
    typescript({ useTsconfigDeclarationDir: true }),
    babel(
      makeBabelConfig({
        useCoreJS: output.format === 'umd',
        useESModules: output.format !== 'cjs'
      })
    ),
    env &&
      replace({
        'process.env.NODE_ENV': JSON.stringify(env)
      }),
    min && uglify()
  ]
});

export default [
  createConfig({
    output: {
      format: 'es',
      file: pkg.module
    }
  }),
  createConfig({
    output: {
      format: 'cjs',
      file: pkg.main
    }
  }),
  createConfig({
    output: {
      format: 'umd',
      file: pkg.unpkg,
      name: 'LiveChat'
    },
    external: 'peers',
    env: 'production',
    min: true
  })
];
