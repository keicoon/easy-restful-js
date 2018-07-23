# EASY_RESTFUL.JS
[![npm](https://img.shields.io/npm/v/pixel-js-k.svg)](https://www.npmjs.com/package/pixel-js-k)
![travis](https://travis-ci.org/keicoon/easy-restful.js.svg?branch=master)  
## Features
- Provice simple design to resultful service and support `npm` module
- Simple interface
- support customize `server`, `db-server`
- default server `express`
- default db-server `redis`
## Install
```
npm i easy-restful
```
## UseCase
### start
```
const EasyRestful = require('easy-restful.js').default;
// const EasyRestful = require('../../easy-restful.js').get({
//     'redis-server-bin-path': '/Users/jo/Downloads/redis-server',
//     'saved-file-path': '/Users/jo/Documents/easy-restful.js/saved/redisdb.json'
// });
```
### register simple restful-api
```
const key = EasyRestful.register('/hello', function (resolve, reject) {
    resolve('hello restful api world');
});

EasyRestful.register('/helloJson', function (resolve, reject) {
    resolve({ "a": 1, "b": "bb" });
});
```
### unreigister restful-api
```
EasyRestful.register('/stopHello', function (resolve, reject) {
    EasyRestful.unrgister(key);
    resolve('success: stophello');
});
```
### using db
```
EasyRestful.register('POST', '/dbAdd/:value', function (resolve, reject) {
    this.db.set('key', this.params.value)
    resolve(`[success] dbAdd : ${this.params.value}`);
});

EasyRestful.register('/dbGet', function (resolve, reject) {
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
EasyRestful.register('/log', function (resolve, reject) {
    resolve(EasyRestful.log, false);
});
```
### close
```
EasyRestful.register('/exit', function (resolve, reject) {
    EasyRestful.close();
});
```
