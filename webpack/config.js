const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {NODE_ENV, isDevelopment, isProduction, projectConfig, pathConfig} = require('../config');

const extractCSS = new ExtractTextPlugin('static/css/[name].[chunkhash].css');

let {dllEntry} = projectConfig;

if (dllEntry) {
    if (Array.isArray(dllEntry)) {
        projectConfig.dllEntry.push('babel-polyfill', 'vue', 'element-ui');
        dllEntry = {
            vendor: projectConfig.dllEntry
        };
    }
} else {
    dllEntry = {
        vue: ['vue', 'element-ui'],
        tools: ['babel-polyfill']
    };
}

module.exports = {
    NODE_ENV,
    isDevelopment,
    isProduction,
    dllEntry,
    extractCSS,
    projectConfig,
    pathConfig
};
