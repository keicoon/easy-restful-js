
const EasyRestful = require('../../easy-restful.js').default;
/* TestCase 'start listen' and get text */
const key = EasyRestful.register('/hello', (send) => {
    send('hello restful api world');
});

console.log('[unit-test] key:', key);