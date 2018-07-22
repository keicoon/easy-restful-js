const util = require('util');
const DEBUG = util.getConfig('isdebug');

module.exports = class EasyRestfulServer {
    constructor(port, serverAdaptorClass) {
        this.log = util.get('log');
        this.adaptor = new serverAdaptorClass(port);
        this.blacklist = new Map();
        return this;
    }

    static get default() {
        return new EasyRestfulServer(3000, ExpressServerAdaptor);
    }

    static get defaultServerAdaptorClass() {
        return ServerAdaptor;
    }

    set DB(dbServer) { this.db = dbServer; }

    isValid(hashKey) {
        return !this.blacklist[hashKey];
    }

    setIgnoreRegax(hashKey) {
        this.blacklist[hashKey] = true;
    }

    command(HTTPMethod, regax, callback) {

        function warppingCallback(requset, response) {
            const key = util.generateHashKey(HTTPMethod + regax);

            if (this.isValid(key) === false) {
                resonse.to('wrong address');
            } else {
                callback(message => {
                    DEBUG && this.log.log(`[${HTTPMethod}] ${regax} -> ${message}`);
                    resonse.to(message);
                }, reqest.params, this.db);
            }
        }
        if (this.adaptor[HTTPMethod] === undefined) {
            DEBUG && this.log.log(`unsupport command ${HTTPMethod}`);
        } else {
            this.adaptor[HTTPMethod](regax, warppingCallback);
        }
    }
}
/* If you are working in an environment where you can not use node.js or use another server module, inherit this class. */
class ServerAdaptor {
    GET(regax, callback) { }
    POST(regax, callback) { }
    PUT(regax, callback) { }
    DELETE(regax, callback) { }
}
/* This class has 'express' dependency. */
class ExpressServerAdaptor extends ServerAdaptor {
    constructor(port) {
        const express = require('express');
        this.app = express();
        this.server = this.app.listen(port, () => {
            this.log.log("Express server has started on port", port)
        });
        return this;
    }

    addSession() {
        // var session = require('express-session');
        // this.app.use(session({
        //     secret: '@#@$MYSIGN#@$#$',
        //     resave: false,
        //     saveUninitialized: true
        // }));
    }

    GET(regax, callback) {
        this.app.get(regax, callback);
    }

    POST(regax, callback) {
        this.app.post(regax, callback);
    }

    PUT(regax, callback) {
        this.app.put(regax, callback);
    }
    DELETE(regax, callback) {
        this.app.delete(regax, callback);
    }
}