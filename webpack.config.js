const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: [
    path.join(__dirname, 'source', 'EP.less'),
    path.join(__dirname, 'source', 'EP.js')
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'app.min.js'
  },
  devServer: {
    contentBase: path.join(__dirname, "build"),
    compress: true,
    disableHostCheck: true,
    port: 9000
  },
  devtool: "source-map",
  module: {
    rules: [{
      test : /\.jsx?/,
      loader : 'babel-loader',
      query: {
        presets: ['react', 'es2015']
      }
    },
    {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        use: ['css-loader', {
          loader: 'less-loader',
          options: {
            compress: true
          }
        }]
      })
    },
    {
      test: /\.(png|ttf|woff)$/,
      use: ['url-loader']
    }]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //     drop_console: true,
    //     unsafe: true
    //   }
    // }),
    new ExtractTextPlugin({
      filename: 'app.min.css'
    })
  ]
};