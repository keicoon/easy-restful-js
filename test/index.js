
const EasyRestful = require('easy-restful.js').default;
/* TestCase 'start listen' and get text */
const key = EasyRestful.register('/hello', () => {
    return 'hello restful api world';
});
/* TestCase 'stop listen' */
EasyRestful.register('/stophello', () => {
    EasyRestful.unrgister(key);
    return 'success: stophello';
});
/* TestCase 'stop listen' and get json */
EasyRestful.register('/test', () => {
    return {
        type: 'json',
        content: JSON.stringify({ "a": 1, "b": "bb" })
    };
});
/* TestCase set data using redis-db */
EasyRestful.register('PUT', '/dbAdd', (db) => {
    db.set('key', value)
    return 'success: dbAdd';
});
/* TestCase get data using redis-db */
EasyRestful.register('/dbGet', (db) => {
    const value = db.get('key');
    // text -> JSON.stringify(value)
    // json -> value
    return {
        type: 'json',
        content: value
    };
});
/* TestCase log */
EasyRestful.register('/log', () => {
    return EasyRestful.log;
});