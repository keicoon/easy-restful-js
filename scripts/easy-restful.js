
const util = require('./util.js');
util.set('isdebug', true);
const log = new (require('./log.js'))();
util.set('log', log);

const EasyRestfulServer = require('./server.js');
const EasyRestfulDBServer = require('./dbserver.js');

module.exports = class EasyRestful {
    constructor(server, dbserver) {
        this.server = server;
        this.dbserver = dbserver;

        this.server.DB = this.dbserver;
    }

    static get(opts) {
        opts.forEach((value, key) => util.set(key, value));
        return this.default;
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

    get log() { return log.toString(); }

    close() {
        this.dbserver.close();
        this.server.close();
    }

    register(HTTPMethod, regax, callback) {
        if (typeof regax === 'function') {
            callback = regax; regax = HTTPMethod; HTTPMethod = 'GET';
        }
        this.server.command(HTTPMethod, regax, callback);
        return util.generateHashKey(HTTPMethod + regax);
    }

    unregister(hashKey) {
        this.server.setIgnoreRegax(hashKey);
    }
}

