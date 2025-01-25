const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = {
  entry: {
    mainGame         : './js/MainGame/MainGame.ts',
    randomGame       : './js/MainGame/RandomGame.ts',
    randomGameOptions: './js/MainGame/RandomGameOptions.ts',
    infos            : './js/Stats/Infos.ts',
    checkItem        : './js/CheckItem/Check.ts',
    checkGroup       : './js/CheckGroup/Check.ts',
    groupCreator     : './js/GroupCreator/MainGroupCreator.ts',
    stats            : './js/Stats/Stats.ts',
    statsMod         : './js/StatsMod.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/dist/',
    // Ensure we keep the module system
    module: true,
    library: {
      type: 'module'
    }
  },
  experiments: {
    outputModule: true
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'js/')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  optimization: {
    minimizer: [new TerserPlugin({
      terserOptions: {
        format: {
          comments: false,
        },
      },
      extractComments: false,
    })],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackManifestPlugin({
      publicPath: '/dist/'
    })
  ],
  mode: 'production'
};