var SSH = require('../'),
    exec = require('child_process').exec;

function run(cmd, done) {
    exec(cmd, function(err, stdout, stderr) {
        err && done(err);
        console.log(cmd);
        console.log('err', err);
        console.log('stdout', stdout);
        console.log('stderr', stderr);
        done();
    });
}

before(function(done) {
    var dir = __dirname,
        cmd = [
            // 'cp ' + dir + '/ssh_kit_test_key ~/.ssh',
            // 'chmod 600 ~/.ssh/ssh_kit_test_key',
            'cat ' + dir + '/ssh_kit_test_key.pub >> ~/.ssh/authorized_keys',
            'mv ~/.ssh/authorized_keys ~/.ssh/authorized_keys.tmp',
            'chmod 600 ~/.ssh/authorized_keys && ls -la ~/.ssh'
        ].join(' && ');

    exec(cmd, function(err, stdout, stderr) {
        if (err) {
            return console.error(err);
        }

        console.log('executing: ' + cmd);
        console.log('stdour: ' + stdout);
        console.log('stderr: ' + stderr);
        done();
    });
});

after(function() {
    var cmd = [
        'rm ~/.ssh/authorized_keys',
        'mv ~/.ssh/authorized_keys.tmp ~/.ssh/authorized_keys'
    ];
    exec(cmd, function(err, stdout, stderr) {
        if (err) {
            return console.error(err);
        }

        console.log('executing: ' + cmd);
        console.log('stdour: ' + stdout);
        console.log('stderr: ' + stderr);
        done();
    });

});

describe('ssh-kit', function() {
    beforeEach(function() {
        this.ssh = new SSH();
    });

    it('connects to ssh', function(done) {
        this.ssh.set('host', 'localhost');
        this.ssh.set('sshKey', '~/.ssh/ssh_kit_test_key');
        this.ssh.exec('ls');
        this.ssh.on('finish', done);
    });
});
