const ExtractTextPlugin = require('extract-text-webpack-plugin')
const {
    NODE_ENV,
    isDevelopment,
    isProduction,
    projectConfig,
    pathConfig
} = require('../config')

const extractCSS = new ExtractTextPlugin('static/css/[name].[chunkhash].css')

let dllEntry = projectConfig.dllEntry

if(dllEntry) {
    if(Array.isArray(dllEntry)) {
        dllEntry = {
            vendor: projectConfig.dllEntry
        }
    }
}else {
    dllEntry = {
        vue: [
            'vue',
            'element-ui'
        ],
        react: [
            'react',
            'react-dom',
            'prop-types',
            'react-addons-pure-render-mixin',
            'antd'
        ],
        tools: [
            'babel-polyfill',
            'classnames'
        ]
    }
}

Object.entries(dllEntry).forEach(([k, v]) => {
    if (v.includes('element-ui')) {
        const {version} = require('element-ui/package');
        v.push(`element-ui/lib/theme-${version.startsWith('1') ? 'default' : 'chalk'}/index.css`);
    }
});

module.exports = {
    NODE_ENV,
    isDevelopment,
    isProduction,
    dllEntry,
    extractCSS,
    projectConfig,
    pathConfig
}
