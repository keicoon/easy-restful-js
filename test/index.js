const EasyRestful = require('../../easy-restful.js').get({
    'redis-server-bin-path': 'C:\\Program Files\\Redis\\redis-server.exe',
    'redis-server-conf': 'C:\\Program Files\\Redis\\conf\\redis-dist.conf',
    'saved-file-path': __dirname + '\\..\\data\\db.json',
    'use-https': true,
    'key-path': './test/private'
});
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

// setTimeout(() => {
//     console.log('Automatically exited "EasyRestful".');
//     EasyRestful.close();
// }, 5000);