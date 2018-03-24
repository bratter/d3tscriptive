/**
 * Base webpack configuration
 */

const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = function(mode, context, dir) {
  const outPath = path.join(context, dir)

  return {
    mode: mode,
    context: context,
    entry: {
      d3tscriptive: './src',
    },
    output: {
      path: outPath,
      filename: '[name].js',
      library: 'd3ts',
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: '/node_modules/',
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract(['css-loader', 'sass-loader']),
          exclude: '/node_modules/',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    plugins: [
      new CleanWebpackPlugin(outPath, { root: context }),
      new ExtractTextPlugin('d3tscriptive.css'),
    ],
    externals: /d3-?/,
  }
}
