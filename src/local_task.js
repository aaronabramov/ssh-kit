var spawn = require('child_process').spawn,
    chalk = require('chalk');

/**
 * @param {Object} options
 * @param {String} options.cmd command to exec
 * @param {Object} options.ctx context of execution
 * @param {Function} options.callback fn to execute when process is spawned
 */
function LocalTask(options) {
    this.cmd = options.cmd;
    this.ctx = options.ctx;
    this.callback = options.callback;
}

LocalTask.prototype.run = function(done) {
    var child = spawn(this.cmd, args);
    if (!this.ctx.get('quiet')) {
        console.log(chalk.underline.cyan('executing:'), this.cmd);
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
    }
    if (typeof this.callback === 'function') {
        this.callback(child);
    }
    child.on('close', function(code) {
        if (code !=- 0) {
            done('error. exit code: ' + code);
        } else {
            done();
        }
    });
};

module.exports = LocalTask;
