const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const {isDevelopment, pathConfig, projectConfig} = require('../config')
const assetProxyMiddleware = require('./middlewares/assetProxyMiddleware')
const mockMiddleware = require('./middlewares/mockMiddleware')
const webpackMiddleware = require('./middlewares/webpackMiddleware')


const app = new Koa()


app.use(bodyParser())

if(isDevelopment) {
    app.use(mockMiddleware())
    webpackMiddleware(app)
}else {
    app.use(assetProxyMiddleware())
}


app.listen(projectConfig.port)
