#!/usr/bin/env node

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const {resolve} = require('path')
const commander = require('commander')
const {exec} = require('child_process')
const {webpackDllBuild, webpackBuild} = require('./webpack')
const {initProject} = require('./utils')
const {prepack} = require('./webpack/utils')

const pkg = require(resolve(__dirname, './package.json'))

commander
    .version(pkg.version)
    .usage('[Options]')
    .option('init', '初始化项目')
    .option('dll', 'webpack.dll')
    .option('dev', '开发模式')
    .option('build', 'webpack.build')
    .option('server', 'pm2')
    .parse(process.argv)

if (commander.init) {
    initProject()
}

if (commander.dll) {
    webpackDllBuild()
}

if (commander.dev) {
    prepack()
    require('./server')
}

if (commander.build) {
    prepack()
    webpackBuild()
}

if (commander.server) {
    exec(`pm2 restart ${__dirname}/server`)
}
