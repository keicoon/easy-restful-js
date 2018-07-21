
const EasyRestfulServer = require('server');
const EasyRestfulDBServer = require('dbserver');
const util = require('util');
util.setConfig('isdebug', true);

module.exports = class EasyRestful {
    constructor(server, dbserver) {
        this.server = server;
        this.dbserver = dbserver;
    }
    static get default() {
        return new EasyRestful(EasyRestfulServer.default, EasyRestfulDBServer.default);
    }

    static get innerClasses() {
        return {
            EasyRestfulServer,
            EasyRestfulDBServer
        }
    }
    
    get log() {

    }

    register(HTTPMethod, regax, callback) {
        if (typeof regax === 'function') {
            callback = regax; regax = HTTPMethod; HTTPMethod = 'GET';
        }
        this.server.command(HTTPMethod, regax, callback);
        return util.generateHashKey(HTTPMethod, regax);
    }

    unregister(hashKey) {
        this.server.setIgnoreRegax(hashKey);
    }
}

