const webpack = require('webpack');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [
          /node_modules/,
          /packages/
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'dist.js',
    path: __dirname,
  },
  plugins: [
    new webpack.BannerPlugin({ banner: '#! /usr/bin/env node', raw: true }),
  ],
};
