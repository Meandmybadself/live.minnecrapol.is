const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src/javascripts/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  resolve: {
    alias: {
      atoms: path.resolve(__dirname, 'src/javascripts/components/atoms'),
      molecules: path.resolve(__dirname, 'src/javascripts/components/molecules'),
      organisms: path.resolve(__dirname, 'src/javascripts/components/organisms'),
      templates: path.resolve(__dirname, 'src/javascripts/components/templates'),
      utilities: path.resolve(__dirname, 'src/javascripts/utilities'),
      images: path.resolve(__dirname, 'src/images'),
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      STREAM_URL: JSON.stringify(process.env.MINNE_STREAM_URL || 'http://localhost:8420/live/poopy/index.m3u8')
    }),
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: path.resolve(__dirname, 'dist/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'index.css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(s*)css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.png$/,
        use: {
          loader: 'file-loader'
        }
      }
    ]
  }
}