var SSH = require('../'),
    exec = require('child_process').exec;
describe('ssh-kit', function() {
    beforeEach(function() {
        this.ssh = new SSH();
    });

    it('connects to ssh', function(done) {
        var dir = __dirname;

        this.ssh.set('host', 'localhost');
        this.ssh.set('sshKey', dir + '/ssh_kit_test_key');
        this.ssh.exec('ls');
        this.ssh.on('finish', done);

        exec('mv ' + dir + '/ssh_kit_test_key ~/.ssh', function(err, stdout, stderr) {
            console.log('mv ssh_kit_test_key.pub ~/.ssh');
            console.log('err', err);
            console.log(stdout);
            console.log('-', stderr);
        });

        exec('cat ' + dir + '/ssh_kit_test_key.pub >> ~/.ssh/authorized_keys', function(err, stdout, stderr) {
            console.log('mv ssh_kit_test_key.pub ~/.ssh');
            console.log('err', err);
            console.log(stdout);
            console.log('-', stderr);
        });


        exec('ls -la ~', function(err, stdout, stderr) {
            console.log('err', err);
            console.log(stdout);
            console.log('-', stderr);
        });
        exec('ls -la ~/.ssh', function(err, stdout, stderr) {
            console.log('err', err);
            console.log(stdout);
            console.log('-', stderr);
        });

        exec('hostname', function(err, stdout, stderr) {
            console.log('err', err);
            console.log(stdout);
            console.log('-', stderr);
        });
    });
});
