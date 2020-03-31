require('dotenv').config()

const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src/javascripts/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/javascripts/components'),
      screens: path.resolve(__dirname, 'src/javascripts/screens'),
      routers: path.resolve(__dirname, 'src/javascripts/routers'),
      context: path.resolve(__dirname, 'src/javascripts/context'),
      utilities: path.resolve(__dirname, 'src/javascripts/utilities'),
      images: path.resolve(__dirname, 'src/images'),
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      STREAM_URL: JSON.stringify(process.env.MINNE_LIVE_STREAM_URL),
      API_HOST: JSON.stringify(process.env.MINNE_LIVE_API_HOST)
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