const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/app.js',
    publicPath: '/',
    libraryTarget: 'umd'
  },
  devtool: process.env.NODE_ENV === 'production' ? 'none' : 'inline-source-map',
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js']
  },
  devServer: {
    contentBase: './public'
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }]
  }
}
