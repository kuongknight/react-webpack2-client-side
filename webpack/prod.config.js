const path = require('path')
const webpack = require('webpack')
const extend = require('extend')
const AssetsPlugin = require('assets-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const autoprefixer = require('autoprefixer')
const INTL_REQUIRE_DESCRIPTIONS = true
const isDebug = false
const isVerbose = true
const config = {
  context: path.resolve(__dirname, '../src'),
  output: {
    path: path.resolve(__dirname, '../build'),
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
          cacheDirectory: isDebug,
          babelrc: false,
          presets: [
            'latest',
            'stage-0',
            'react',
            ...isDebug ? [] : [
              'react-optimize'
            ]
          ],
          plugins: [
            'transform-runtime',
            ...!isDebug ? [] : [
              'transform-react-jsx-source',
              'transform-react-jsx-self'
            ],
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!sass-loader'
        })
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
          name: isDebug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          name: isDebug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]',
          limit: 10000
        }
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, '../src'), 'node_modules'],
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.json']
  },
  bail: !isDebug,
  cache: isDebug,
  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose
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
    filename: isDebug ? '[name].bundle.js' : '[name].[chunkhash:8].bundle.js',
    chunkFilename: isDebug ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js'
  },
  target: 'web',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      'process.env.BROWSER': true,
      __DEV__: isDebug
    }),
    new AssetsPlugin({
      path: path.resolve(__dirname, '../build'),
      filename: 'assets.js',
      processOutput: x => `module.exports = ${JSON.stringify(x, null, 2)}`
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor.bundle',
      minChunks: module => /node_modules/.test(module.resource),
      filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js'
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
    new ExtractTextPlugin('style-[hash].css'),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: isVerbose
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    new HtmlWebpackPlugin({
      title: 'My App'
    }),
    new CleanWebpackPlugin(['build'], {root: path.resolve(__dirname, '../')})
  ],
  devtool: 'source-map',
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
})

module.exports = clientConfig
