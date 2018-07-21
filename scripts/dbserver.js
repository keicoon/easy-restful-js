const util = require('util');
const DEBUG = util.getConfig('isdebug');
module.exports = class EasyRestfulDBServer {
    constructor() {
        this.app = require('redis');
    }

    static get default() {
        return new EasyRestfulDBServer();
    }

    get(key) {
        return this.app.get(key);
    }

    set(key, value) {
        return this.app.get(key, value);
    }
}