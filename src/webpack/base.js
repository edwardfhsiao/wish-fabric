const webpack = require('webpack');
const path = require('path');
const PATH = require('./build_path');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const stylelintRules = require('../../stylelint.config.js');
const styleVariables = require(path.join(PATH.SOURCE_PATH, 'css/variables'));

var config = (module.exports = {
  context: PATH.ROOT_PATH,
  entry: {
    index: PATH.ROOT_PATH + 'src/js/index.jsx'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{ loader: 'eslint-loader', options: { emitWarning: true } }]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['env', 'react', 'stage-2'] }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)\??.*$/,
        use: [{ loader: 'url-loader?limit=8192&name=font/[name].[ext]' }]
      },
      {
        test: /\.(jpe?g|png|gif|svg)\??.*$/,
        use: [{ loader: 'url-loader?limit=8192&name=img/[name].[ext]' }]
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                // ident: 'postcss',
                plugins: loader => [
                  require('postcss-import')({
                    root: loader.resourcePath
                  }),
                  require('autoprefixer')(),
                  require('cssnano')()
                ]
              }
            }
          ]
        })
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                // ident: 'postcss',
                plugins: loader => [
                  require('postcss-import')({
                    root: loader.resourcePath
                  }),
                  require('autoprefixer')(),
                  require('cssnano')()
                ]
              }
            }
          ]
        })
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.coffee', '.json'],
    alias: {
      STYLES: path.join(PATH.SOURCE_PATH, '/css'),
      COMMON: path.join(PATH.SOURCE_PATH, 'js/common'),
      API: path.join(PATH.SOURCE_PATH, 'js/api'),
      APP: path.join(PATH.SOURCE_PATH, 'js/app'),
      CONSTS: path.join(PATH.SOURCE_PATH, 'js/consts/index.js'),
      COMPONENTS: path.join(PATH.SOURCE_PATH, 'js/app/components'),
      PAGES: path.join(PATH.SOURCE_PATH, 'js/app/pages'),
      ACTIONS: path.join(PATH.SOURCE_PATH, 'js/actions'),
      STORE: path.join(PATH.SOURCE_PATH, 'js/store'),
      REDUCERS: path.join(PATH.SOURCE_PATH, 'js/reducers')
    }
  },
  output: {
    path: PATH.ASSET_PATH,
    filename: 'js/[name].js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    disableHostCheck: true,
    // public: 'your-host:8080',
    host: '192.168.1.200',
    // host: '192.168.50.90',
    port: 1990
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: 'commons',
      chunks: ['lib', 'index']
    }),
    new webpack.ContextReplacementPlugin(
      /\.\/locale$/,
      'empty-module',
      false,
      /js$/
    ),
    new webpack.ProvidePlugin({
      React: 'React',
      react: 'React',
      'window.react': 'React',
      'window.React': 'React',
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new ManifestPlugin({
      fileName: 'rev-manifest.json'
    }),
    // new webpack.DllReferencePlugin({
    //   context: PATH.ROOT_PATH,
    //   manifest: require(path.join(
    //     PATH.ASSET_PATH,
    //     './react_vendors-manifest.json'
    //   ))
    // }),
    new HtmlWebpackPlugin({
      template: PATH.HTML_PATH + '/layout.html',
      title: 'image-editor',
      page: 'index',
      filename: 'index.html',
      hash: false,
      customJs: '/config/index.js',
      chunksSortMode: function(chunk1, chunk2) {
        var orders = ['common', 'index'];
        var order1 = orders.indexOf(chunk1.names[0]);
        var order2 = orders.indexOf(chunk2.names[0]);
        if (order1 > order2) {
          return 1;
        } else if (order1 < order2) {
          return -1;
        } else {
          return 0;
        }
      }
    }),
    new CopyWebpackPlugin([
      {
        from: PATH.ROOT_PATH + '/src/config/',
        to: PATH.ROOT_PATH + '/dist/config/'
      }
    ])
    // new AddAssetHtmlPlugin({
    //   hash: true,
    //   filepath: require.resolve(PATH.ASSET_PATH + '/react_vendors.js'),
    //   includeSourcemap: false
    // })
    // new CopyWebpackPlugin([
    //   { from: PATH.ROOT_PATH + 'src/config.js', to: PATH.ROOT_PATH + 'dist/config.js' },
    // ])
    // new webpack.DllReferencePlugin({
    //   context: PATH.ROOT_PATH,
    //   manifest: require(path.join(PATH.ASSET_PATH, './jquery-manifest.json'))
    // }),
  ]
});
