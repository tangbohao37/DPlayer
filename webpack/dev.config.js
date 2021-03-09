const baseConfig = require('./common.config');
const { merge } = require('webpack-merge');
const path = require('path');

const devConfig = {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        compress: true,
        contentBase: path.resolve(__dirname, '..', 'demo'),
        clientLogLevel: 'debug',
        quiet: false,
        open: true,
        historyApiFallback: {
            disableDotRule: true,
        },
        watchOptions: {
            ignored: /node_modules/,
        },
    },
    performance: {
        hints: false,
    },
};

module.exports = merge(baseConfig, devConfig);
