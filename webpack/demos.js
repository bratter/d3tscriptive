const path = require('path')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const HTMLWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')

const base = require('./base')
const demoList = require('./demo-list').map(d => d.path)

// TODO: Optimize library includes for demos:
//       Remove jQuery dependency
//       Build core javascript/bootstrap into webpack entry point
// TODO: Consider naming convention for demos - should output be flattened for better consumer experience
// TODO: Make home page more interesting
// TODO: Add API doc generation to the demo output
// TODO: Think about how to make it obvious that scrolling exists on mobile
// TODO: Add active element to header menu
// TODO: Add some way to interact with the component's API in the demo
// TODO: Show the code in the demo

// Good resource for hbs layouts: https://cloudfour.com/thinks/the-hidden-power-of-handlebars-partials/

function demoPluginResults(demos) {
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

const demoCore = (mode, context, dir) => ({
  mode: mode,
  context: context,
  entry: {
    demos: './templates/scripts/demos',
  },
  output: {
    path: path.join(context, dir),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.hbs$/,
        use: { 
          loader: 'handlebars-loader',
          options: { rootRelative: `${context}/templates/`, helperDirs: [`${context}/templates/helpers`] },
        },
        exclude: '/node_modules/',
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract(['css-loader', 'sass-loader']),
        exclude: '/node_modules/',
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('demos.css'),
    new CopyWebpackPlugin([
      {
        from: 'src/**/demo/*.js',
        to: '[1]/[2].js',
        test: /src(.*)[\/\\]demo[\/\\](.*)\.js$/,
      },
      {
        from: 'node_modules/d3/dist/d3.min.js',
        to: 'd3.min.js',
      },
      {
        from: 'node_modules/jquery/dist/jquery.slim.min.js',
        to: 'jquery.slim.min.js',
      },
      {
        from: 'node_modules/popper.js/dist/umd/popper.min.js',
        to: 'popper.min.js',
      },
      {
        from: 'node_modules/bootstrap/dist/js/bootstrap.min.js',
        to: 'bootstrap.min.js',
      },
      {
        from: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
        to: 'bootstrap.min.css',
      },
    ]),
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: './templates/home.hbs',
    }),
    new HTMLWebpackIncludeAssetsPlugin({
      assets: [
        'd3.min.js',
        'jquery.slim.min.js',
        'popper.min.js',
        'bootstrap.min.js',
        'bootstrap.min.css',
        'd3tscriptive.js',
        'd3tscriptive.css',
      ],
      append: false,
    }),
  ]
})

// Assets have to be injected after all the HTML plugins to work properly
const demoPlugins = demoPluginResults(demoList);

module.exports = function(mode, context, dir) {
  return merge(
    { plugins: demoPlugins.html },
    demoCore(mode, context, dir),
    { plugins: demoPlugins.assets },
  )
}
