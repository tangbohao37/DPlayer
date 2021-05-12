const baseConfig = require('./common.config');
const { merge } = require('webpack-merge');

const prodConfig = {
    mode: 'production',
    // output: {
    //     filename: '[name].min.js',
    // },
};

module.exports = merge(baseConfig, prodConfig);
