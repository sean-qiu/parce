const {writeFileSync} = require('fs')
const {ensureFileSync, ensureDirSync} = require('fs-extra');
const {resolve} = require('path')
const {pathConfig} = require('../config')
const {entry} = require('../extra')

const vueTemplate = path => [
    `import entry from '${path}';`,
    'new Vue({',
    '    el: \'#app\',',
    '    render: h => h(entry)',
    '});'
].join('\n')

const produceVueTemplateJs = () => {
    ensureDirSync(pathConfig.viewTemp)
    Object.entries(entry).forEach(([k, v]) => {
        if(v.includes(pathConfig.viewTemp)) {
            ensureFileSync(v)
            writeFileSync(v, vueTemplate(resolve(pathConfig.view, k, 'index.vue')))
        }
    })
}

module.exports = () => {
    produceVueTemplateJs()
}
