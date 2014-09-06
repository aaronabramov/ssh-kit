// ONLY USE ON CI BECAUSE IT MESSES UP `authorized_keys`

var SSH = require('../');

describe('ssh-kit', function() {
    beforeEach(function() {
        this.ssh = new SSH();
    });

    it('connects to ssh', function(done) {
        this.ssh.set('host', 'localhost');
        this.ssh.set('quiet', true);
        this.setKey(this.ssh);
        this.ssh.exec('ls');
        this.ssh.on('finish', done);
    });
});
