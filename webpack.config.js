import webpack from 'webpack';
import { URL } from 'url';

export default {
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
    filename: 'dist.cjs',
    path: new URL('.', import.meta.url).pathname,
  },
  plugins: [
    new webpack.BannerPlugin({ banner: '#! /usr/bin/env node', raw: true }),
  ],
  target: 'node',
};
