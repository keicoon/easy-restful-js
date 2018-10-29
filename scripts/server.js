const util = require('./util.js');
const DEBUG = util.get('enable-debug-mode');
const log = util.get('log');
let prettyHtml;
const bPrettyHtml = util.get('use-pretty-html');
if(bPrettyHtml) prettyHtml = require('json-pretty-html').default;

module.exports = class EasyRestfulServer {
    constructor(port, serverAdaptorClass) {
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

    close() {
        this.adaptor.server.close();
    }

    setIgnoreRegax(hashKey) {
        this.blacklist[hashKey] = true;
    }

    command(HTTPMethod, regax, callback) {
        log.log(`[express-server] restfulAPI ${HTTPMethod} -> ${regax}`);
        function warppingCallback(requset, response) {
            const key = util.generateHashKey(HTTPMethod + regax);

            if (this.isValid(key) === false) {
                response.send('wrong address');
            } else {
                const _module = {
                    params: requset.params,
                    body: this.adaptor.usingBodyParser ? requset.body : {},
                    query: requset.query,
                    db: this.db,
                    callback
                };
                const moduleCallback = _module.callback.bind(_module);
                moduleCallback(
                    (message, usingLog = true) => {
                        DEBUG && usingLog && log.log(`[${HTTPMethod}] ${regax} -> ${message}`);
                        if (typeof message === "object" && bPrettyHtml) {
                            message = prettyHtml(message, message.dimensions);
                        }
                        response.send(message);
                    },
                    error => {
                        response.status(404).json({ error });
                    }
                );
            }
        }

        if (this.adaptor[HTTPMethod] === undefined) {
            DEBUG && log.log(`unsupport command ${HTTPMethod}`);
        } else {
            this.adaptor[HTTPMethod](regax, warppingCallback.bind(this));
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
        super();
        // optional
        this.usingBodyParser = false;

        const express = require('express');
        this.app = express();
        this.app.use(express.static('public'));
        if (this.usingBodyParser) {
            const bodyParser = require('body-parser');
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: true }));
        }
        this.server = this.app.listen(port, () => {
            log.log("[express-server] start on port", port)
        });
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