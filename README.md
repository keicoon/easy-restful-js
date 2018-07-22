# EASY_RESTFUL.JS
- Provice simple design to resultful service and support `npm` module
## Features
- Simple interface
- support customize `server`, `db-server`
- default server `express`
- default db-server `redis`
## UseCase
### start
```
const EasyRestful = require('easy-restful.js').default;
```
### register simple restful-api
```
const key = EasyRestful.register('/hello', (send) => {
    send('hello restful api world');
});

EasyRestful.register('/hellojson', (send) => {
    send({
        type: 'json',
        content: JSON.stringify({ "a": 1, "b": "bb" })
    });
});
```
### unreigister restful-api
```
EasyRestful.register('/stophello', (send) => {
    EasyRestful.unrgister(key);
    send('success: stophello');
});
```
### using db
```
EasyRestful.register('PUT', '/dbAdd', (send, params, db) => {
    db.set('key', value)
    send('success: dbAdd');
});

EasyRestful.register('/dbGet', (send, params, db) => {
    db.get_callback('key', (value) => {
        send({
            type: 'json',
            content: value
        });
    });
    // db.get('key').then(value => {
    //     send({
    //         type: 'json',
    //         content: value
    //     });
    // });
});
```
### log
```
EasyRestful.register('/log', (send) => {
    send(EasyRestful.log);
});
```
### close
```
EasyRestful.close();
```