const path = require('path');
const Copy = require('copy-webpack-plugin');

let common_config = {
  node: {
    __dirname: true
  },
  mode: process.env.ENV || 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [
          /node_modules/,
           path.resolve(__dirname, "src/ui")
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
};
console.log(path.resolve(__dirname, './src/renderer/index.html'))
module.exports = [
  Object.assign({}, common_config, {
    target: 'electron-main',
    entry: {
      main: './src/main/index.ts',
    },
    output: {
      filename: '[name]-bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
  }),
  Object.assign({}, common_config, {
    target: 'electron-renderer',
    entry: {
      ui: './src/renderer/index.ts',
    },
    output: {
      filename: '[name]-bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
  }),
]