var chalk = require('chalk'),
    EventEmitter = require('events').EventEmitter,
    Immutable = require('immutable'),
    util = require('util'),
    debug = require('./debug'),
    config = require('./config'),
    Task = require('./task');

/*
 * @constructor
 */
function RemoteExec() {
    this.queue = [];
    // Context of task execution. Immutable
    this.ctx = Immutable.Map({});
}

util.inherits(RemoteExec, EventEmitter);

// define setter
RemoteExec.prototype.set = function(k, v) {
    if (!config.ATTRIBUTES_HASH[k]) {
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

module.exports = RemoteExec;
