const os = require('os');
const HappyPack = require('happypack');
const {isDevelopment, isProduction, extractCSS, projectConfig} = require('../config');

const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});

const createHappyPlugin = (id, loaders) =>
    new HappyPack({
        id,
        loaders,
        threadPool: happyThreadPool,
        verbose: false
    });

const styleLanguageList = [
    {
        language: 'css',
        suffix: 'css',
        happypackID: 'css',
        loaders: ['css']
    },
    {
        language: 'less',
        suffix: 'less',
        happypackID: 'less',
        loaders: ['css', 'less']
    }
];

if (Array.isArray(projectConfig.styles)) {
    if (projectConfig.styles.includes('scss')) {
        styleLanguageList.push(
            {
                language: 'scss',
                suffix: 'scss',
                happypackID: 'scss',
                loaders: ['css', 'sass']
            },
            {
                language: 'sass',
                suffix: 'sass',
                happypackID: 'scss',
                loaders: ['css', 'sass']
            }
        );
    }
    if (projectConfig.styles.includes('stylus')) {
        styleLanguageList.push({
            language: 'stylus',
            suffix: 'styl',
            happypackID: 'stylus',
            loaders: ['css', 'stylus']
        });
    }
}

const styleQuery = {
    style: {},
    css: {minimize: isProduction},
    less: {},
    stylus: {},
    sass: {},
    scss: {}
};

const vueStyleLoaders = styleLanguageList.reduce((prev, cur) => {
    if (isDevelopment) {
        prev[cur.language] = ['vue-style', ...cur.loaders].map(v => `${v}-loader`);
    } else {
        prev[cur.language] = extractCSS.extract({
            fallback: 'vue-style-loader',
            use: cur.loaders.map(v => ({
                loader: `${v}-loader`,
                options: styleQuery[v]
            }))
        });
    }
    return prev;
}, {});

const rules = styleLanguageList.map(v => {
    if (isDevelopment) {
        return {
            test: new RegExp(`\\.${v.suffix}$`),
            use: [`happypack/loader?id=${v.happypackID}`]
        };
    } else {
        return {
            test: new RegExp(`\\.${v.suffix}$`),
            use: extractCSS.extract({
                fallback: 'style-loader',
                use: v.loaders.map(v => ({
                    loader: `${v}-loader`,
                    options: styleQuery[v]
                }))
            })
        };
    }
});

const plugins = styleLanguageList.map(v =>
    createHappyPlugin(
        v.language,
        ['style', ...v.loaders].map(v => ({
            path: `${v}-loader`,
            query: styleQuery[v]
        }))
    )
);

module.exports = {createHappyPlugin, vueStyleLoaders, rules, plugins};
