let path = require('path');

module.exports = {
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
      }
    ],
  },

  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
  },

  devtool: 'source-map',
};
