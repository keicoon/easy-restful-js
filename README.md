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
const key = EasyRestful.register('/hello', () => {
    return 'hello restful api world';
});

EasyRestful.register('/hellojson', () => {
    return {
        type: 'json',
        content: JSON.stringify({ "a": 1, "b": "bb" })
    };
});
```
### unreigister restful-api
```
EasyRestful.register('/stophello', () => {
    EasyRestful.unrgister(key);
    return 'success: stophello';
});
```
### using db
```
EasyRestful.register('PUT', '/addDB', (db) => {
    db.set('key', value)
    return 'success: dbAdd';
});

EasyRestful.register('/getDB', (db) => {
    const value = db.get('key');
    // text -> JSON.stringify(value)
    // json -> value
    return {
        type: 'json',
        content: value
    };
});
```
### log
```
EasyRestful.register('/log', () => {
    return EasyRestful.log;
});
```