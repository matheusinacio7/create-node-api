import * as path from 'path';
import { URL } from 'url';

import webpack from 'webpack';

const dirname = new URL('.', import.meta.url).pathname;

export default {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [
          /node_modules/,
          /packages/,
          /manual_test/
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      "@builders": path.resolve(dirname, 'src', 'builders'),
      "@packages": path.resolve(dirname, 'src', 'packages'),
      "@utils": path.resolve(dirname, 'src', 'utils'),
      "@middlewares": path.resolve(dirname, 'src', 'middlewares'),
    },
  },
  output: {
    filename: 'dist.cjs',
    path: dirname,
  },
  plugins: [
    new webpack.BannerPlugin({ banner: '#! /usr/bin/env node', raw: true }),
  ],
  target: 'node',
};
