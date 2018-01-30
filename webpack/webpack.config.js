const {isAbsolute} = require('path')
const {pathConfig, isDevelopment} = require('./config')
const rules = require('./rules')
const plugins = require('./plugins')
const {webpackConfig: extra} = require('./extra')

let webpackConfig = {
    module: {rules},
    plugins,
    ...extra
}

isDevelopment || Object.entries(extra.entry).forEach(([k, v]) => {
    webpackConfig.entry[k] = ['babel-polyfill', v]
})

if(pathConfig.webpackConfig && isAbsolute(pathConfig.webpackConfig)) {
    webpackConfig = require(pathConfig.webpackConfig)(webpackConfig)
}

module.exports = webpackConfig
