# Useage

* mkdir your_project
* cd your_project
* yarn init -y
* yarn add parce
* node_modules/.bin/parce init
* yarn run dll
* yarn run dev
* yarn run build
* yarn run server

> parce -h

# Init

> 执行 `init` 操作之后, 会生成一个简易项目模板

```
├── project.config.js
└── src
    ├── common.js
    └── view
        └── index
            └── index.vue
```

* project.config.js 项目配置文件
* src/common.js 项目公用文件
* src/view/\*\*/index.vue 根据 `index.vue` 生成页面

# project.config.js

```
module.exports = {
    port: 8080, // 端口号
    title: '', // 项目标题
    publicPath: '', // publicPath
    pathConfig: {
        src: 'src',
        common: 'src/common.js',
        view: 'src/view',
        webpackConfig: ''
    },
    devServer: {},
    apiProxy: {},
    dllEntry: '', // webpack.dll `[]` || `{}`
    provide: {}, // webpack.ProvidePlugin
    styles: [], // 支持的styles, []
    loaders: [], // rules.loader
}
```

# pathConfig. webpackConfig

```
// webpack/webpack.config.js

module.exports = webpackConfig => {

    // console.log(webpackConfig)

    return webpackConfig
}
```

# webpack.dll 支持打包多个 dll 包

```
// 单个包 (key值默认为 'vendor')

dllEntry: ['vue', 'element-ui']

// 多个包
dllEntry: {
  vue: ['vue', 'element-ui'],
  tools: ['moment/min/moment.min', 'query-string', 'echarts'],
  style: ['normalize.css']
}
```

# alias

> `src` 的所有子目录

# webpack.ProvidePlugin

> project.config.js provide

```
{
    qs: 'query-string',
    _: 'lodash'
}
```

# 支持的 style

```
less 默认支持
scss 需要安装: `node-sass` `sass-loader`
stylus 需要安装: `stylus` `stylus-loader`
```

> project.config.js styles

```
styles: []
styles: ['less']
styles: ['stylus']
styles: ['less', 'stylus']
```

# .npmrc

```
registry=https://registry.npm.taobao.org
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
```

# .gitignore

```
.DS_Store
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
.temp
```
