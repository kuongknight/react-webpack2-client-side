const path = require('path')
const webpack = require('webpack')
const extend = require('extend')
const AssetsPlugin = require('assets-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const autoprefixer = require('autoprefixer')
const INTL_REQUIRE_DESCRIPTIONS = true
const config = {
  context: path.resolve(__dirname, '../src'),
  output: {
    path: path.resolve(__dirname, '../build/public/assets'),
    publicPath: '/assets/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, '../src')
        ],
        query: {
          cacheDirectory: true,
          babelrc: false,
          presets: [
            'latest',
            'stage-0',
            'react'
          ],
          plugins: [
            'transform-runtime',
            'transform-react-jsx-source',
            'transform-react-jsx-self',
            ['react-intl',
              {
                enforceDescriptions: INTL_REQUIRE_DESCRIPTIONS
              }
            ]
          ]
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader?importLoaders=1&modules&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader'
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file-loader',
        query: {
          name: '[path][name].[ext]?[hash:8]'
        }
      },
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          name: '[path][name].[ext]?[hash:8]',
          limit: 10000
        }
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, '../src'), 'node_modules'],
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.json']
  },
  bail: false,
  cache: true,
  stats: {
    colors: true,
    reasons: true,
    hash: true,
    version: true,
    timings: true,
    chunks: true,
    chunkModules: true,
    cached: true,
    cachedAssets: true
  },
  devServer: {
    contentBase: './src',
    historyApiFallback: true,
    port: 3000,
    compress: false,
    inline: true,
    hot: true,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: '\u001b[32m'
      }
    }
  }
}

//
// Configuration for the client-side bundle (client.js)
//

const clientConfig = extend(true, {}, config, {
  entry: {
    client: '../src/client.js'
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  target: 'web',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
      'process.env.BROWSER': true,
      __DEV__: true
    }),
    new CopyWebpackPlugin([
      { from: '../node_modules/bootstrap/dist/css' },
      { from: '../node_modules/bootstrap/dist/fonts' },
    ]),
    new AssetsPlugin({
      path: path.resolve(__dirname, '../build'),
      filename: 'assets.js',
      processOutput: x => `module.exports = ${JSON.stringify(x, null, 2)}`
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor.bundle',
      minChunks: module => /node_modules/.test(module.resource),
      filename: '[name].js'
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer({
            browsers: [
              'last 3 version',
              'ie >= 10'
            ]
          })
        ],
        context: '../src'
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'cheap-module-source-map',
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
})

module.exports = clientConfig
