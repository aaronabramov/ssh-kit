// ONLY USE ON CI BECAUSE IT MESSES UP `authorized_keys`

var SSH = require('../');

describe('ssh-kit', function() {
    beforeEach(function() {
        this.ssh = new SSH();
    });

    it('connects to ssh', function(done) {
        this.ssh.set('host', 'localhost');
        // relative `~/.ssh` does not work on travis
        this.ssh.set('sshKey', '/home/travis/.ssh/ssh_kit_test_key');
        this.ssh.exec('ls');
        this.ssh.on('finish', done);
    });
});
