const path = require('path');
const webpack = require('webpack');

module.exports = [{
  entry: [
    'babel-polyfill',
    './frontend/app.js',
  ],

  // The fuck is the point of nesting this under "module"?
  module: {
    loaders: [
      {
        test: /(\.js|\.jsx)/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    })
  ],

  resolve: {
    modules: [
      path.resolve('./frontend'),
      path.resolve('./node_modules'),
    ],
  },

  output: {
    path: path.join(__dirname, 'static/build'),
    filename: 'bundle.js',
  },

  devtool: 'source-map',
}, {
  entry: './assets/style.js',

  module: {
    loaders: [
      { test: /\.css/,
        loader: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss/,
        exclude: /node_modules/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
        loader: "file-loader",
        options: { publicPath: "/static/build/" }
      },
    ]
  },

  output: {
    path: path.join(__dirname, 'static/build'),
    filename: 'style.js'
  },

  devtool: 'source-map',
}];
