var SSH = require('../');
describe('ssh-kit', function() {
    beforeEach(function() {
        this.ssh = new SSH();
    });

    it('connects to ssh', function(done) {
        this.ssh.set('host', 'localhost');
        this.ssh.exec('ls');
        this.ssh.on('finish', done);
    });
});
