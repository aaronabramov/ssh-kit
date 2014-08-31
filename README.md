# ssh-kit
minimalist, efficient ssh client for javascript

```javascript
var SSH = require('ssh-kit'),
    ssh = new SSH();

ssh.username('dmitriiabramov');
ssh.host('rheia.us');
ssh.sshKey('~/.ssh/id_rsa');

ssh.exec('pwd');
ssh.exec('ls -la');
ssh.exec('ls');
ssh.on('finish', console.log.bind(console, 'all done!'));
```


```javascript
// TODO:

ssh.set('forward-agent', true);

ssh.with({dir: '~/test', env: {ENV: 'test'}, servers: ['s1', 's2'], function() {
    ssh.exec('forever start ./run.js');
});
```
