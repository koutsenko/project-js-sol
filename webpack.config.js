const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  resolve: {
    modules: [
      path.join(__dirname, 'source', 'js'),
      'node_modules'
    ],
    alias: {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  },
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
      exclude: /node_modules/,
      query: {
        presets: ['react', 'es2015']
      }
    },
    {
      test: /\.svg$/,
      use: [{
        loader: 'svg-url-loader'
      },{
        loader: 'svgo-loader',
        options: {
          plugins: [
            {convertPathData: {floatPrecision: 1, transformPrecision: 1}},
            {cleanupNumericValues: {floatPrecision: 1}},
            {removeTitle: true},
            {removeViewBox: true}
          ]
        }
      }]
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
      test: /\.(ttf|woff)$/,
      use: ['url-loader']
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false,
        unsafe: true,
      },
      sourceMap: true
    }),
    new ExtractTextPlugin({
      filename: 'app.min.css'
    })
  ]
};