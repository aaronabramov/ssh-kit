var RemoteExec = require('./'),
    r = new RemoteExec();

r.username('dmitriiabramov');
r.host('rheia.us');
r.exec('pwd');
r.sshKey('~/.ssh/id_rsa');

r.done(function() {
    console.log(arguments);
});
