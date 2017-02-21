const ClosureCompiler = require('google-closure-compiler-js').webpack;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  entry: [
    path.join(__dirname, 'source', 'app.less'),
    path.join(__dirname, 'source', 'app.js')
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'app.min.js'
  },
  module: {
    rules: [
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
      }
    ]
  },
  plugins: [
    new ClosureCompiler({
      options: {
        languageIn: 'ECMASCRIPT5_STRICT',
        compilationLevel: 'ADVANCED_OPTIMIZATIONS',
        warningLevel: 'VERBOSE'
      },
    }),
    new ExtractTextPlugin({
      filename: 'app.min.css'
    })
  ]
};