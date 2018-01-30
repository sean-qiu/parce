const {rules: styleRules} = require('./utils/style')

module.exports = [
    ...styleRules,
    {
        test: /\.vue$/,
        use: 'happypack/loader?id=vue',
        exclude: [/node_modules/]
    },
    {
        test: /\.js$/,
        use: 'happypack/loader?id=js',
        exclude: [/node_modules/]
    },
    {
        test: /\.jsx$/,
        use: 'happypack/loader?id=jsx',
        exclude: [/node_modules/]
    },
    {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/image/[name].[hash].[ext]'
                }
            }
        ]
    }
]
