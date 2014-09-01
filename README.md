# ssh-kit
[![Build Status](https://travis-ci.org/dmitriiabramov/ssh-kit.svg?branch=master)](https://travis-ci.org/dmitriiabramov/ssh-kit)

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

// multiple servers in parallel
ssh.addServer('s1');
ssh.addServer('s2');

// ssh options
ssh.set('forward-agent', true);

// additional parameters
ssh.with({dir: '~/test', env: {ENV: 'test'}, servers: ['s1', 's2'], function() {
    ssh.exec('forever start ./run.js');
});

// utils

ssh.mkdirIfNotExists('~/test1'); // etc...


// Testing
create temporary `authorized_keys` file and restore original in after hook
```
