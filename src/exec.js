var chalk = require('chalk'),
    EventEmitter = require('events').EventEmitter,
    Immutable = require('immutable'),
    util = require('util'),
    debug = require('./debug'),
    config = require('./config'),
    LocalTask = require('./local_task'),
    RemoteTask = require('./remote_task');

/*
 * @constructor
 */
function Exec() {
    this.queue = [];
    // Context of task execution. Immutable
    this.ctx = Immutable.Map({});
}

util.inherits(Exec, EventEmitter);

// define setter
Exec.prototype.set = function(k, v) {
    if (!config.ATTRIBUTES_HASH[k]) {
        throw new Error('unknown attribute: ' + k);
    }
    this.ctx = this.ctx.set(k, v);
};

// TODO: DRY
Exec.prototype.exec = function(cmd, callback) {
    this.queue.push(new RemoteTask({
        cmd: cmd,
        ctx: this.ctx,
        // will be invoked with child process as an argument
        callback: callback
    }));
    this.start();
};

// TODO: DRY
Exec.prototype.local_exec = function(cmd, callback) {
    this.queue.push(new LocalTask({
        cmd: cmd,
        ctx: this.ctx,
        // will be invoked with child process as an argument
        callback: callback
    }));
};

Exec.prototype.start = function() {
    if (!this.isRunning) {
        this.emit('start');
        debug('start');
        this.isRunning = true;
        this.callNext();
    }
};

Exec.prototype.stop = function() {
    debug('stop');
    this.isRunning = false;
    this.emit('finish');
};

Exec.prototype.callNext = function() {
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

module.exports = Exec;
