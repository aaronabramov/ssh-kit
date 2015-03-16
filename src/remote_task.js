var spawn = require('child_process').spawn,
    chalk = require('chalk');

/**
 * @param {Object} options
 * @param {String} options.cmd command to exec
 * @param {Object} options.ctx context of execution
 * @param {Function} options.callback fn to execute when process is spawned
 */
function RemoteTask(options) {
    this.cmd = options.cmd;
    this.ctx = options.ctx;
    this.callback = options.callback;
}

RemoteTask.prototype.run = function(done) {
    var cmd = 'ssh',
        key = this.ctx.get('sshKey'),
        userAndHost;
    if (this.ctx.get('username')) {
        userAndHost = this.ctx.get('username') + '@' + this.ctx.get('host');
    } else {
        userAndHost = this.ctx.get('host');
    }

    args = [
        userAndHost,
        '-o',
        'UserKnownHostsFile=/dev/null',
        '-o',
        'StrictHostKeyChecking=no'
        // '-q',
    ];

    if (key) {
        args.push('-i');
        args.push(key);
    }

    args.push(this.cmd);
    // console.log(cmd, args);
    var child = spawn(cmd, args);
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

module.exports = RemoteTask;
