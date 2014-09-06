var exec = require('child_process').exec;

before(function(done) {
    var dir = __dirname,
        cmd = [
            'cp ' + dir + '/ssh_kit_test_key ~/.ssh',
            'chmod 600 ~/.ssh/ssh_kit_test_key',
            'cat ' + dir + '/ssh_kit_test_key.pub >> ~/.ssh/authorized_keys',
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

    // shared fn to set ssh key
    this.setKey = function(ssh) {
        // relative `~/.ssh` does not work on travis
        ssh.set('sshKey', '/home/travis/.ssh/ssh_kit_test_key');
    };
});
