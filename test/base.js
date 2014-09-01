var SSH = require('../'),
    exec = require('child_process').exec;

function run(cmd) {
    exec(cmd, function(err, stdout, stderr) {
        console.log(cmd);
        console.log('err', err);
        console.log('stdout', stdout);
        console.log('stderr', stderr);
    });
}

before(function(done) {
    var dir = __dirname,
        cmd = [
            'cp ' + dir + '/ssh_kit_test_key /home/travis/.ssh',
            'chmod 600 /home/travis/.ssh/ssh_kit_test_key',
            'cat ' + dir + '/ssh_kit_test_key.pub >> /home/travis/.ssh/authorized_keys',
            'chmod 600 /home/travis/.ssh/authorized_keys'
        ].join(' && ');

    exec(cmd, function(err, stdout, stderr) {
        if (err) {
            console.err(err);
            process.exit(1);
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
