
const EasyRestful = require('../../easy-restful.js').default;
// const EasyRestful = require('../../easy-restful.js').get({
//     'redis-server-bin-path': '/Users/jo/Downloads/redis-server',
//     'saved-file-path': '/Users/jo/Documents/easy-restful.js/saved/redisdb.json'
// });
/* TestCase 'start listen' and get text */
const key = EasyRestful.register('/hello', function (resolve, reject) {
    resolve('hello restful api world');
});
/* TestCase 'stop listen' */
EasyRestful.register('/stophello', function (resolve, reject) {
    EasyRestful.unrgister(key);
    resolve('success: stophello');
});
/* TestCase 'stop listen' and get json */
EasyRestful.register('/test', function (resolve, reject) {
    resolve({ "a": 1, "b": "bb" });
});
/* TestCase set data using redis-db */
EasyRestful.register('POST', '/dbAdd/:value', function (resolve, reject) {
    this.db.set('key', this.params.value)
    resolve(`[success] dbAdd : ${this.params.value}`);
});
/* TestCase get data using redis-db */
EasyRestful.register('/dbGet', function (resolve, reject) {
    this.db.get_callback('key', (value) => {
        resolve(value);
    });
    // this.db.get('key').then(value => {
    //     resolve(value);
    // });
});
/* TestCase log */
EasyRestful.register('/log', function (resolve, reject) {
    resolve(EasyRestful.log, false);
});

setTimeout(() => {
    console.log('Automatically exited "EasyRestful".');
    EasyRestful.close();
}, 5000);