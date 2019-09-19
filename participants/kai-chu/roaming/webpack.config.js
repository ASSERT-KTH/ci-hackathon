const path = require('path');

module.exports = {
    entry: './src/index.js',
    devServer: {
        contentBase: './dist',
        publicPath: 'http://localhost:8080/',
        open: 'Google Chrome'
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    }
};
//yarn add webpack --dev
//yarn add webpack-cli --dev
// this is the default webpack.config.js
// can be used by npx webpack --config webpack.config.js
//  yarn add webpack-dev-server --dev
// add devServer key configuration
// can be used by  webpack-dev-server --open