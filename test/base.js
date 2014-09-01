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

describe('ssh-kit', function() {
    beforeEach(function() {
        this.ssh = new SSH();
    });

    it('connects to ssh', function(done) {
        var dir = __dirname;

        run('pwd');
        run('whoami');
        run('cd ~ && pwd');

        run('cp ' + dir + '/ssh_kit_test_key /home/travis/.ssh/id_rsa');
        run('chmod 600 /home/travis/.ssh/id_rsa');

        run('cat ' + dir + '/ssh_kit_test_key.pub >> /home/travis/.ssh/authorized_keys');

        run('chmod 600 /home/travis/.ssh/authorized_keys');

        run('ls -la /home/travis/.ssh');

        setTimeout(function() {
            this.ssh.set('host', 'localhost');
            this.ssh.set('sshKey', dir + '/ssh_kit_test_key');
            this.ssh.exec('ls');
            this.ssh.on('finish', done);
        }, 500);

    });
});
