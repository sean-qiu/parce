const {log, only} = require('../../utils');
const formatStats = require('./formatStats');
const prepack = require('./prepack');

const noop = () => {};

module.exports = {
    log,
    only,
    noop,
    formatStats,
    prepack
};
