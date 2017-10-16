var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = function(env) {
  var config = {
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
          presets: ['react']
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
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')],
              sourceMap: true,
            }
          }, {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              compress: true,
              relativeUrls: false
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
      new ExtractTextPlugin({
        filename: 'app.min.css'
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(env.prod ? 'production' : 'dev')
        }
      })
    ]
  }

  if (env.prod) {
    config.plugins.push(
      new UglifyJSPlugin({
        sourceMap : true,
        parallel  : true
      })
    );
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'report.html'
      })
    );
  }

  return config;
}
