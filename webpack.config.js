const path = require('path');
const argv = require('yargs').argv;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  context: process.cwd(),
  mode: argv.develop ? 'development' : 'production',
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  devServer: {
    open: true,
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    watchContentBase: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
      },
    ],
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
