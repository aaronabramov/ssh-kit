var exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    chalk = require('chalk'),
    path = require('path'),
    EventEmitter = require('events').EventEmitter,
    util = require('util'),
    ATTRIBUTES = 'username host sshKey'.split(/\s+/),
    DEBUG = true;


function debug() {
    if (DEBUG) {
        console.log.apply(console, [chalk.underline.green('DEBUG:') + ' '].concat(Array.prototype.slice.call(arguments)));
    }
};

function RemoteExec() {
    this.queue = [];
    this.ctx = {};
};

util.inherits(RemoteExec, EventEmitter);

// define setters
ATTRIBUTES.forEach(function(attribute) {
    RemoteExec.prototype[attribute] = function(val) {
        return this.ctx[attribute] = val;
    };
});

RemoteExec.prototype.remote = function() {
    return this.ctx.username + '@' + this.ctx.host;
};

RemoteExec.prototype.exec = function(cmd, callback) {
    this.queue.push(new Task({
        cmd: cmd,
        ctx: this.ctx,
        callback: callback
    }));
    this.start();
};

RemoteExec.prototype.start = function() {
    if (!this.isRunning) {
        this.emit('start');
        debug('start');
        this.isRunning = true;
        this.callNext();
    }
};

RemoteExec.prototype.stop = function() {
    debug('stop');
    this.isRunning = false;
    this.emit('finish');
};

RemoteExec.prototype.callNext = function() {
    var _this = this;

    setTimeout(function() {
        var task = _this.queue.shift();
        if (!task) {
            return _this.stop();
        }
        task.run(function(err) {
            if (err) {
                throw err;
            }
            _this.callNext();
        });
    }, 5);
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
        this.cmd
    ];
    console.log(cmd, args);
    console.log(chalk.underline.cyan('executing:'), this.cmd);
    var child = spawn(cmd, args);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('close', function(code) {
        done();
    });
};

module.exports = RemoteExec;
