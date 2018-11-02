

const EasyRestful = require('../index.js').get({
    'redis-server-bin-path': 'C:\\Program Files\\Redis\\redis-server.exe',
    'redis-server-conf': 'C:\\Program Files\\Redis\\conf\\redis-dist.conf',
    'saved-file-path': __dirname + '\\..\\data\\db.json',
    'server-port': 80,
    'use-body-parser': true
});

EasyRestful.register('/hello', function (resolve, reject) {
    resolve('hello restful api world');
});


EasyRestful.register('POST', '/happy-meal', function (resolve, reject) {
    // const body = this.body;
    let data = {
        response_type: 'spam', // public to the channel
        text: '302: Found',
        attachments: [
            {
                image_url: 'https://http.cat/302.jpg'
            }
        ]
    };
    resolve(data);
});