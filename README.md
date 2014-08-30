```javascript
var remoteExec = require('remote-exec'),
    r = new remoteExec();

r.server('user@localhost');

r.exec('cd ~ && git clone git@github.com:dmitriiabramov/sharkhorse.git');
```
