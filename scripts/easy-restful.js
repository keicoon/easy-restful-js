
const EasyRestfulServer = require('server');
const EasyRestfulDBServer = require('dbserver');
const util = require('util');
util.setConfig('isdebug', true);

module.exports = class EasyRestful {
    constructor(server, dbserver) {
        const Log = require('log');
        this.log = new Log();
        util.set('log', this.log);
        util.set('isdebug', true);
        
        this.server = server;
        this.dbserver = dbserver;

        this.server.DB = this.dbserver;
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

    get log() { return this.log.toString(); }

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

