const path = require('path');

module.exports = (api) => {
  const isTest = api.env('test');
  const isProduction = api.env('production');

  return {
    presets: [
      '@babel/react',
      '@babel/preset-typescript',
      [
        '@babel/env',
        isTest ? { targets: { node: 'current' } } : { loose: true },
      ],
    ].filter(Boolean),
    plugins: [
      [
        'babel-plugin-module-resolver',
        {
          alias: {
            '@react-forked/dnd':
              process.env.USE_PRODUCTION_BUILD === 'true'
                ? path.resolve(__dirname, './dist/dnd')
                : path.resolve(__dirname, './src/index.ts'),
          },
        },
      ],
      '@babel/transform-object-assign',
      ['@babel/proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
      // used for stripping out the `invariant` messages in production builds
      isProduction ? 'dev-expression' : false,
    ].filter(Boolean),
    comments: false,
  };
};
