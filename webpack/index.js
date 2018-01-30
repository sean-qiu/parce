const fs = require('fs')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const {log, noop, formatStats} = require('./utils')
const {projectConfig} = require('./config')

const webpackCompiler = (webpackConfig, callback = noop) => new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig)
    compiler.run((err, stats) => {
        if(err) {
            log('webpack 编译报错', 'red')
            log(err)
            if (err.details) {
                log(err.details, 'red')
            }
            reject(err)
        }else {
            log(stats.toString(webpackConfig.stats))
            formatStats(stats)
            resolve()
        }
    })
    compiler.plugin('done', callback)
})

const webpackDevServer = () => {
    const webpackConfig = require('./webpack.config')
    const options = {
        hot: true,
        host: 'localhost',
        port: projectConfig.port,
        stats: webpackConfig.stats,
        ...(projectConfig.devServer || {})
    }
    const openUrl = `http://${options.host}:${options.port}/`
    Object.entries(webpackConfig.entry).forEach(([k, v]) => {
        webpackConfig.entry[k] = [`webpack-dev-server/client/index.js?${openUrl}`, v]
    })
    WebpackDevServer.addDevServerEntrypoints(webpackConfig, options)
    const compiler = webpack(webpackConfig)
    const server = new WebpackDevServer(compiler, options)
    server.listen(options.port, options.host, () => console.log('服务启动: ', openUrl))
}

const webpackDllBuild = async () => {
    const webpackDllConfig = require('./webpack.dll.config')
    await webpackCompiler(webpackDllConfig)
}

const webpackBuild = async () => {
    const webpackConfig = require('./webpack.config')
    await webpackCompiler(webpackConfig)
}

module.exports = {webpackDllBuild, webpackBuild, webpackDevServer}
