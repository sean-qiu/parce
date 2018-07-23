const {writeFileSync} = require('fs');
const {ensureFileSync, ensureDirSync} = require('fs-extra');
const {relative, resolve, format} = require('path');
const {isDevelopment, pathConfig, projectConfig} = require('../config');
const {entry} = require('../extra');
const {log} = require('../../utils');

const vueTemplate = path => {
    return [
        'import Vue from "vue";',
        `import entry from "${path.replace(/\\/g, '\\\\')}";`,
        'new Vue({',
        '    el: "#app",',
        '    render: h => h(entry)',
        '});'
    ].join('\n') + '\n';
};

const printRouter = () => {
    if (isDevelopment) {
        log('路由列表:', 'cyan');
        log('-'.repeat(30), 'cyan');

        const domain = `http://localhost:${projectConfig.port}/`;
        Object.keys(entry).forEach(v => {
            let url = '';
            if (v !== 'index') {
                url = `${v}.html`;
            }
            log(domain + url);
        });

        log('-'.repeat(30), 'cyan');
    }
};

const produceVueTemplateJs = () => {
    ensureDirSync(pathConfig.viewTemp);
    Object.entries(entry).forEach(([k, v]) => {
        if (v.includes(pathConfig.viewTemp)) {
            ensureFileSync(v);
            if (process.platform === 'win32') {
                writeFileSync(v, vueTemplate(format({
                    dir: resolve(pathConfig.view, k),
                    base: 'index.vue'
                })));
            } else {
                writeFileSync(v, vueTemplate(relative(pathConfig.src, resolve(pathConfig.view, k, 'index.vue'))));
            }
        }
    });
};

module.exports = () => {
    printRouter();
    produceVueTemplateJs();
};
