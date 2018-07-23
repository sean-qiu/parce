const {dirname, resolve, relative} = require('path');
const glob = require('glob');
const {isDevelopment, pathConfig, projectConfig} = require('./config');

const entry = glob.sync(`${pathConfig.view}/**/index.vue`).reduce((prev, cur) => {
    const entryKey = dirname(relative(pathConfig.view, cur));
    const entryVal = resolve(pathConfig.viewTemp, entryKey, 'index.js');
    prev[entryKey] = entryVal;
    return prev;
}, {});

const alias = glob.sync(`${pathConfig.src}/*`, {nodir: false}).reduce((prev, cur) => {
    prev[cur.split('/').slice(-1)[0]] = cur;
    return prev;
}, {});

const webpackConfig = {
    entry: Object.assign({common: pathConfig.common}, entry),
    output: {
        path: pathConfig.dist,
        filename: `static/js/[name]${isDevelopment ? '' : '.[chunkhash]'}.js`,
        publicPath: projectConfig.publicPath
    },
    resolve: {
        alias,
        extensions: ['.js', '.json', '.vue'],
        modules: ['node_modules']
    },
    resolveLoader: {
        modules: ['node_modules']
    },
    performance: {
        hints: false
    },
    stats: {
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        warningsFilter: warnings =>
            [
                'component lists rendered with v-for should have explicit keys',
                'the "scope" attribute for scoped slots have been deprecated and replaced by "slot-scope" since 2.5'
            ].some(v => warnings.includes(v))
    },
    devtool: isDevelopment ? 'eval-source-map' : ''
};

module.exports = {webpackConfig, entry};
