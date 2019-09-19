const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8080
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CopyPlugin([
          { from: 'public', to: '.' },
        ]),
    ],
};