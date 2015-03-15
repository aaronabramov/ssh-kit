var chalk = require('chalk'),
    config = require('./config');

module.exports = function () {
    if (config.DEBUG) {
        console.log.apply(console, [chalk.underline.green('DEBUG:') + ' '].concat(Array.prototype.slice.call(arguments)));
    }
};
