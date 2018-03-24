const path = require('path')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const HTMLWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')

const base = require('./base')

// TODO: Add bootstrap - might need to go in externals here, or maybe just build into css output
// TODO: Build handlebars templates
// TODO: Consider where to put the list of demos - it will be needed for the templates too
// TODO: Consider naming convention for demos - should output be flattened for better consumer experience

const demos = [
  'components/grid',
  // 'components/aug-axis/',
]

function demoPluginResults() {
  const html = [], assets = []

  demos.forEach(d => {
    let path = d.charAt(d.length - 1) === '/' ? d.substr(0, d.length - 1) : d

    html.push(new HTMLWebpackPlugin({
      filename: `${path}/index.html`,
      template: `./src/${path}/demo/index.hbs`,
    }))
    
    assets.push(new HTMLWebpackIncludeAssetsPlugin({
      files: [`${path}/index.html`],
      assets: [`${path}/demo.js`],
      append: true,
    }))
  })

  return { html, assets }
}

const demoCore = {
  module: {
    rules: [
      {
        test: /\.hbs$/,
        use: 'handlebars-loader',
        exclude: '/node_modules/',
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'src/**/demo/*.js',
        to: '[1]/[2].js',
        test: /src(.*)[\/\\]demo[\/\\](.*)\.js$/,
      },
      {
        from: 'node_modules/d3/build/d3.min.js',
        to: 'd3.min.js',
      }
    ]),
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: './templates/home.hbs',
    }),
    new HTMLWebpackIncludeAssetsPlugin({
      assets: ['d3.min.js'],
      append: false,
    }),
  ],
}

// Assets have to be injected after all the HTML plugins to work properly
const demoPlugins = demoPluginResults();

module.exports = function(mode, context, dir) {
  return merge(
    base(mode, context, dir),
    { plugins: demoPlugins.html },
    demoCore,
    { plugins: demoPlugins.assets,
  })
}
