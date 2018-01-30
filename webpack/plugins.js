const {resolve} = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const AssetsWebpackPlugin = require('assets-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')

const {
    NODE_ENV,
    isDevelopment,
    isProduction,
    pathConfig,
    projectConfig,
    dllEntry,
    extractCSS
} = require('./config')

const {createHappyPlugin, vueStyleLoaders, plugins: stylePlugins} = require('./utils/style')

const {entry} = require('./extra')

const HtmlWebpackPluginList = Object.entries(entry).map(([k, v]) => new HtmlWebpackPlugin({
    filename: resolve(pathConfig.dist, `${k}.html`),
    template: pathConfig.template,
    title: projectConfig.title,
    chunks: ['common', k],
    NODE_ENV
}))

const plugins = [
    ...stylePlugins,
    createHappyPlugin('js', [
            {
                loader: 'babel-loader',
                options: {
                    plugins: ['transform-runtime'],
                    presets: ['env', 'stage-1']
                }
            }
        ]),
        createHappyPlugin('jsx', [
            {
                loader: 'babel-loader',
                options: {
                    plugins: [
                        'transform-runtime',
                        [
                            'import',
                            {
                                libraryName: 'antd',
                                style: true
                            }
                        ]
                    ],
                    presets: ['env', 'stage-1', 'react']
                }
            }
        ]),
        createHappyPlugin('vue', [
            {
                loader: 'vue-loader',
                options: {
                    loaders: {
                        ...vueStyleLoaders,
                        js: {
                            loader: 'babel-loader',
                            options: {
                                plugins: ['transform-runtime', 'transform-vue-jsx'],
                                presets: ['env', 'stage-1']
                            }
                        }
                    }

                }
            }
        ]),
    new webpack.ProgressPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin({}),
    new webpack.ProvidePlugin({
        classnames: 'classnames',
        React: 'react',
        ReactDOM: 'react-dom',
        PureRenderMixin: 'react-addons-pure-render-mixin',
        PropTypes: 'prop-types',
        ...(projectConfig.provide || {})
    }),
    // new webpack.IgnorePlugin(/\.\/locale$/),
    new CopyWebpackPlugin([
        {
            from: resolve(pathConfig.dll, 'static'),
            to: 'static'
        },
        {
            from: pathConfig.favicon,
            to: 'static'
        }
    ]),
    ...Object.keys(dllEntry).map(v => new webpack.DllReferencePlugin({
        manifest: require(`${pathConfig.dll}/${v}.json`)
    })),
    new HtmlWebpackIncludeAssetsPlugin({
        append: false,
        assets: Object.entries(require(`${pathConfig.dll}/index.json`)).map(([k, v]) => Object.values(v)).reduce((prev, cur) => {
            prev.push(...cur)
            return prev
        }, [])
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        minChunks: 3
    })
]

if (isDevelopment) {
    plugins.push(...[
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ])
} else {
    plugins.push(...[
        extractCSS,
        new CleanWebpackPlugin([pathConfig.dist], {
            root: pathConfig.root,
            verbose: false
        }),
        new AssetsWebpackPlugin({
            path: pathConfig.asset,
            filename: 'index.json',
            prettyPrint: true
        }),
        ...HtmlWebpackPluginList
    ])
}
if (isProduction) {
    plugins.push(new ParallelUglifyPlugin({
        uglifyJS: {
            compress: {
                warnings: false
            }
        }
    }))
}

module.exports = plugins
