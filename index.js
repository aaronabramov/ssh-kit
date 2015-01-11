var exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    chalk = require('chalk'),
    path = require('path'),
    EventEmitter = require('events').EventEmitter,
    Immutable = require('immutable'),
    util = require('util'),
    ATTRIBUTES = [
        'username',
        'host',
        'sshKey',
        'quiet'
    ],
    ATTRIBUTES_HASH = {},
    DEBUG = false;

ATTRIBUTES.forEach(function(attr) {
    ATTRIBUTES_HASH[attr] = true;
});


function debug() {
    if (DEBUG) {
        console.log.apply(console, [chalk.underline.green('DEBUG:') + ' '].concat(Array.prototype.slice.call(arguments)));
    }
};

/*
 * @constructor
 */
function RemoteExec() {
    this.queue = [];
    // Context of task execution. Immutable
    this.ctx = Immutable.Map({});
};

util.inherits(RemoteExec, EventEmitter);

// define setter
RemoteExec.prototype.set = function(k, v) {
    if (!ATTRIBUTES_HASH[k]) {
        throw new Error('unknown attribute: ' + k);
    }
    this.ctx = this.ctx.set(k, v);
};

RemoteExec.prototype.exec = function(cmd, callback) {
    this.queue.push(new Task({
        cmd: cmd,
        ctx: this.ctx,
        // will be invoked with child process as an argument
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
                process.stderr.write(chalk.red(err) + '\n');

                process.exit(1);
            }
            _this.callNext();
        });
    }, 5);
};


/**
 * @param {Object} options
 * @param {String} options.cmd command to exec
 * @param {Object} options.ctx context of execution
 * @param {Function} options.callback fn to execute when process is spawned
 */
function Task(options) {
    this.cmd = options.cmd;
    this.ctx = options.ctx
    this.callback = options.callback;
}

Task.prototype.run = function(done) {
    var cmd = 'ssh',
        userAndHost, key;
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

    if (key = this.ctx.get('sshKey')) {
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
        if (code != 0) {
            done('error. exit code: ' + code);
        } else {
            done();
        }
    });
};

module.exports = RemoteExec;
