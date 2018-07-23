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
const key = EasyRestful.register('/hello', (resolve, reject) => {
    resolve('hello restful api world');
});

EasyRestful.register('/helloJson', (resolve, reject) => {
    resolve({ "a": 1, "b": "bb" });
});
```
### unreigister restful-api
```
EasyRestful.register('/stopHello', (resolve, reject) => {
    EasyRestful.unrgister(key);
    resolve('success: stophello');
});
```
### using db
```
EasyRestful.register('POST', '/dbAdd/:value', (resolve, reject) => {
    this.db.set('key', this.params.value)
    resolve(`[success] dbAdd : ${this.params.value}`);
});

EasyRestful.register('/dbGet', (resolve, reject) => {
    this.db.get_callback('key', (value) => {
        resolve(value);
    });
    // this.db.get('key').then(value => {
    //     resolve(value);
    // });
});
```
### log
```
EasyRestful.register('/log', (resolve, reject) => {
    resolve(EasyRestful.log, false);
});
```
### close
```
EasyRestful.register('/exit', (resolve, reject) => {
    EasyRestful.close();
});
```