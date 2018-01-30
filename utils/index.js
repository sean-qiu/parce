const {writeFileSync} = require('fs')
const {copySync, writeJsonSync} = require('fs-extra')
const {relative, resolve} = require('path')
const glob = require('glob')
const chalk = require('chalk')

const rootPath = process.cwd()
const projectTemplate = resolve(__dirname, '../templates')

const pkgPathThis = resolve(__dirname, '../package.json')
const pkgPathProject = `${rootPath}/package.json`

const pkgThis = require(pkgPathThis)
const {name: pkgName} =  pkgThis

let pkg = require(pkgPathProject)

const scripts = {
    init: `${pkgName} init`,
    'dll-dev': `NODE_ENV=development ${pkgName} dll`,
    'dll-prod': `NODE_ENV=production ${pkgName} dll`,
    dev: `NODE_ENV=development ${pkgName} dev`,
    build: `NODE_ENV=production ${pkgName} build`,
    server: `${pkgName} server`
}

try{
    Object.assign(pkg.scripts, scripts)
}catch(e) {
    pkg.scripts = scripts
}

const strGitIgnore = [
    '.DS_Store',
    'node_modules',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',
    'package-lock.json',
    '.temp'
]

const strNpmrc = [
    'registry=https://registry.npm.taobao.org',
    'sass_binary_site=https://npm.taobao.org/mirrors/node-sass/'
]

const produceConfigFile = (file, str) => {
    writeFileSync(`${rootPath}/${file}`, str.join('\n') + '\n')
}

// 初始化项目
const initProject = () => {
    copySync(projectTemplate, rootPath)
    glob.sync(`${projectTemplate}/**/*`, {nodir: true, dot: true})
    .filter(v => !v.includes('.DS_Store'))
    .map((v, i, arr) => log(`${i === arr.length - 1 ? '└─' : '├─'} ${relative(projectTemplate, v)}`, 'green'))

    writeJsonSync(pkgPathProject, pkg, {spaces: 2})

    produceConfigFile('.npmrc', strNpmrc)
    produceConfigFile('.gitignore', strGitIgnore)
}

// 打印带颜色的信息
const log = (str, color) => console.log(color ? chalk[color](str) : str)

// only
const only = (data = {}, keys = []) => keys.filter(v => Object.keys(data).includes(v)).reduce((prev, cur) => {
    prev[cur] = data[cur]
    return prev
}, {})

module.exports = {initProject, log, only}
