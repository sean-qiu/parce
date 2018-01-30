const {existsSync} = require('fs')
const {resolve} = require('path')

const {NODE_ENV} = process.env
const [isDevelopment, isProduction] = [NODE_ENV === 'development', NODE_ENV === 'production']
const rootPath = process.cwd()
const tempPath = resolve(rootPath, '.temp')

let projectConfig = {
    port: 8080,
    title: 'senses-parce',
    publicPath: isDevelopment ? '/' : '/dist/',
    dllEntry: '',
    pathConfig: {},
    provide: {},
    styles: ''
}

if(existsSync(`${rootPath}/project.config.js`)) {
    const customProjectConfig = require(`${rootPath}/project.config.js`)
    Object.assign(projectConfig, customProjectConfig)
    if(customProjectConfig.publicPath) {
        projectConfig.publicPath = isDevelopment ? '/' : customProjectConfig.publicPath
    }
}

const pathConfig = Object.assign({
    root: rootPath,
    src: resolve(rootPath, 'src'),
    mock: resolve(rootPath, 'mock'),
    temp: tempPath,
    viewTemp: resolve(tempPath, 'view'),
    asset: resolve(tempPath, 'asset'),
    dist: resolve(rootPath, 'dist'),
    common: resolve(rootPath, 'src/common.js'),
    view: resolve(rootPath, 'src/view'),
    favicon: resolve(__dirname, 'favicon.ico'),
    template: resolve(__dirname, 'webpack/utils/template.ejs'),
    webpackConfig: ''
}, projectConfig.pathConfig);

pathConfig.dll = resolve(pathConfig.src, 'asset', isProduction ? 'dll-prod' : 'dll-dev');
pathConfig.dllVersion = resolve(pathConfig.dll, 'version.json');

module.exports = {
    NODE_ENV,
    isDevelopment,
    isProduction,
    pathConfig,
    projectConfig
}
