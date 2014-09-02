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
        'sshKey'
    ],
    ATTRIBUTES_HASH = {},
    DEBUG = true;

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
        'StrictHostKeyChecking=no',
        '-q',
    ];

    if (key = this.ctx.get('sshKey')) {
        args.push('-i');
        args.push(key);
    }

    args.push(this.cmd);
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
