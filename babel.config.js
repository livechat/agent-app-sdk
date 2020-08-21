/**
 * Dedicated only to `jest` as it cannot read a `rollup` babel configuration dedicated for build process.
 * @see https://jestjs.io/docs/en/getting-started#using-typescript
 * @see https://stackoverflow.com/questions/45327218/how-do-i-get-jest-to-run-tests-against-a-rollupbabel-build
 */
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript'
  ]
};
