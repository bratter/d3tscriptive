const base = require('./webpack/base')
const demos = require('./webpack/demos')

const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// TODO: Bundle declarations in dist - need to add declarations: true in tsconfig when do this
// TODO: minified bundle and sourcemaps in dist

module.exports = (env) => {
  const output = env && env.output || 'dist',
        mode = env && env.production ? 'production' : 'development'

  switch (output) {
    case 'dist':
      return base(mode, __dirname, output)    
    case 'demos': 
      return [
        base(mode, __dirname, output),
        demos(mode, __dirname, output)
      ]
  }
}
