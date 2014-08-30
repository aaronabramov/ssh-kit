var exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    chalk = require('chalk'),
    path = require('path');

function RemoteExec() {
    this.queue = [];
    this.ctx = {};
};

RemoteExec.prototype.username = function(username) {
    this.ctx.username = username;
};

RemoteExec.prototype.host = function(host) {
    this.ctx.host = host;
};

RemoteExec.prototype.remote = function() {
    return this.ctx.username + '@' + this.ctx.host;
};

RemoteExec.prototype.sshKey = function(filepath) {
    this.ctx.sshKey = filepath;
};


RemoteExec.prototype.exec = function(cmd) {
    this.queue.push(new Task({
        type: 'ssh',
        cmd: cmd,
        ctx: this.ctx
    }));
};

RemoteExec.prototype.done = function(callback) {
    var _this = this;

    function callNext() {
        var task = _this.queue.shift();
        if (!task) {
            return callback();
        }
        task.run(function(err) {
            if (err) {
                throw err;
            }
            callNext();
        });
    }
    callNext();
};


function Task(options) {
    this.type = options.type;
    this.cmd = options.cmd;
    this.ctx = options.ctx
}

Task.prototype.run = function(done) {
    var cmd = 'ssh';
    args = [
        this.ctx.username + '@' + this.ctx.host,
        '-q',
        '"' + this.cmd + '"'
    ];
    console.log(chalk.underline.cyan('executing:'), this.cmd);
    var child = spawn(cmd, args);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
};

module.exports = RemoteExec;
