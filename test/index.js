
const EasyRestful = require('easy-restful.js').default;
/* TestCase 'start listen' and get text */
const key = EasyRestful.register('/hello', (send) => {
    send('hello restful api world');
});
/* TestCase 'stop listen' */
EasyRestful.register('/stophello', (send) => {
    EasyRestful.unrgister(key);
    send('success: stophello');
});
/* TestCase 'stop listen' and get json */
EasyRestful.register('/test', (send) => {
    send({
        type: 'json',
        content: JSON.stringify({ "a": 1, "b": "bb" })
    });
});
/* TestCase set data using redis-db */
EasyRestful.register('PUT', '/dbAdd', (send, params, db) => {
    db.set('key', value)
    send('success: dbAdd');
});
/* TestCase get data using redis-db */
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
/* TestCase log */
EasyRestful.register('/log', (send) => {
    send(EasyRestful.log);
});