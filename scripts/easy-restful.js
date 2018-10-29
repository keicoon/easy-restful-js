
const util = require('./util.js');
util.set('enable-debug-mode', true);
util.set('use-pretty-html', false);
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
        for (const key in opts) {
            util.set(key, opts[key]);
        }
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

