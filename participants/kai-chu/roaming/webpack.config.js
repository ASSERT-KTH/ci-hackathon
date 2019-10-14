const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8080
    },
    externals: ['tls', 'net', 'fs'],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({title: "Roaming CI", template: './public/index.html'}),
        new CopyWebpackPlugin([{ context: 'public/assets', from: '**/*', to: 'assets' }])
    ],
};