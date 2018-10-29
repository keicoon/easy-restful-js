const util = require('./util.js');
const fs = require('fs');
const DEBUG = util.get('enable-debug-mode');
const log = util.get('log');

module.exports = class EasyRestfulDBServer {
    constructor(port) {
        // optional
        this.usingPromise = false;
        this.usingSave = true;
        this.savedFilePath = util.get('saved-file-path');

        this._openServer(port);
        this._openClient(port);
    }

    static get default() {
        return new EasyRestfulDBServer(6379);
    }

    close() {
        const _close = (() => {
            this.client && this.client.end(true);
            this.server && this.server.close();
        }).bind(this);

        if (this.usingSave) {
            this._saveServer(this.savedFilePath).then(_close).catch(_close);
        } else {
            _close();
        }
    }

    get_callback(key, callback) {
        this.client.get(key, function (err, reply) {
            let result;
            if (reply == null) { err = "can find key"; }
            else { result = reply.toString(); }
            DEBUG && (err == null ? log.log(`[redis-client] get -> ${key} -> ${result}`)
                : log.log(`[redis-client] get fail -> ${key} -> ${err}`)
            );
            callback(result);
        });
    }

    get(key) {
        if (this.usingPromise === false) {
            log.log(`[redis-client] unsupport function, check this.usingPromise`);
            return false;
        } else {
            return this.client.getAsync(key);
        }
    }

    set(key, value) {
        this.client.set(key, value, function (err, reply) {
            DEBUG && (err == null ? log.log(`[redis-client] set -> ${key}:${value} -> ${reply.toString()}`)
                : log.log(`[redis-client] set fail -> ${key} -> ${err}`)
            );
        });
    }

    _isServerValid() {
        return this.server !== undefined;
    }

    _openServer(port) {
        if (this._isServerValid()) return;

        const RedisServer = require('redis-server');
        const bin = util.get('redis-server-bin-path');
        const conf = util.get('redis-server-conf');
        
        log.log(`[redis-server] try to open ${port} ${bin}.`);
        if (bin === undefined) {
            log.log(`[redis-server] invalid bin path.`);
            return;
        } else {
            this.server = new RedisServer({ port, bin, conf });
            this.server.open(err => {
                (err === null) ? log.log(`[redis-server] open success in port ${port}.`)
                    : log.log(`[redis-server] open failed in port ${port} : ${err}.`)
            })

            this._loadServer(this.savedFilePath);
        }
    }

    _saveServer(__jsonFilePath) {
        if (this._isServerValid() == false || __jsonFilePath == undefined) return Promise.reject();

        return new Promise((resolve, reject) => {
            this.client.multi()
                .keys('*', function (err, keys) {
                    if (err) return reject(err);

                    let json = {};
                    let savedKeyNum = 0;
                    function saveFile() {
                        if (++savedKeyNum >= keys.length) {
                            fs.writeFileSync(__jsonFilePath, JSON.stringify(json, null, '\t'), 'utf8');
                            log.log(`[redis-client] ${__jsonFilePath} saved.`);
                            resolve();
                        }
                    }

                    if (keys.length < 1) return reject();

                    keys.forEach(key => {
                        this.get_callback(key, (value) => {
                            json[key] = value;
                            saveFile();
                        });
                    });
                }.bind(this))
                .exec(function (err, replies) { });
        });
    }

    _loadServer(__jsonFilePath) {
        if(__jsonFilePath == undefined) return;

        fs.readFile(__jsonFilePath, 'utf8', ((err, text) => {
            const json = JSON.parse(text || '{}');
            if (json && Object.keys(json).length > 0) {
                for (const key in json) {
                    this.set(key, json[key]);
                }
                log.log(`[redis-client] ${__jsonFilePath} loaded.`);
            }
        }).bind(this));
    }

    _openClient(port) {
        if (this._isServerValid() == false) return;

        const redis = require("redis");
        if (this.usingPromise) bluebird.promisifyAll(redis.RedisClient.prototype);

        this.client = redis.createClient(port);
        log.log(`[redis-client] try to connect ${port}`);
        this.client.on("error", function (err) {
            log.log(`[redis-server] connect failed in port ${port} : ${err}`);
        });
    }
}