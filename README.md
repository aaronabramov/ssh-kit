# ssh-kit
minimalist, efficient ssh client for javascript

```javascript
var RemoteExec = require('./'),
    r = new RemoteExec();

r.username('dmitriiabramov');
r.host('rheia.us');
r.sshKey('~/.ssh/id_rsa');

r.exec('pwd');
r.exec('ls -la');
r.exec('ls');
r.on('finish', console.log.bind(console, 'all done!'));
```
