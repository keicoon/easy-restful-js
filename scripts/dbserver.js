const util = require('util');
const fs = require('fs');
const DEBUG = util.getConfig('isdebug');
module.exports = class EasyRestfulDBServer {
    constructor(port) {
        this.log = util.get('log');
        // optional
        this.usingPromise = false;
        this.usingSave = true;

        this._openServer(port);
        this._openClient(port);
    }

    static get default() {
        return new EasyRestfulDBServer(6379);
    }

    close() {
        if (this.usingSave) {
            this._saveServer();
        }

        this.client.end(true);
        this.server.close();
    }

    get_callback(callback, key) {
        this.client.set(key, (err, reply) => {
            const result = reply.toString();
            DEBUG && (err ? this.log.log(`[redis-client] get : ${result}`)
                : this.log.log(`[redis-client] get fail : ${key} -> ${err}`)
            );
            callback(result);
        });
    }

    get(key) {
        if (this.usingPromise === false) {
            this.log.log(`[redis-client] unsupport function, check this.usingPromise`);
            return false;
        } else {
            return this.client.getAsync(key);
        }
    }

    set(key, value) {
        this.client.set(key, value, (err, reply) => {
            DEBUG && (err ? this.log.log(`[redis-client] set : ${reply.toString()}`)
                : this.log.log(`[redis-client] set fail : ${key} -> ${err}`)
            );
        });
    }

    _isServerValid() {
        return this.server !== undefined;
    }

    _openServer(port) {
        if (this._isServerValid()) return;

        const RedisServer = require('redis-server');
        this.server = new RedisServer(port);
        this.log.log(`[redis-server] try to open ${port}.`);
        this.server.open(err => {
            this.log.log(`[redis-server] open failed in port ${port} : ${err}.`);
        })

        this._loadServer();
    }

    _saveServer(__jsonFilePath = `${__path}/saved/redisdb.json`) {
        this.client.keys('*', (err, keys) => {
            var r = {};
            let savedKeyNum = 0;
            function saveFile() {
                if (++savedKeyNum >= keys.length) {
                    fs.writeFile(__jsonFilePath, JSON.stringify(r));
                    this.log.log(`[redis-client] ${__jsonFilePath} saved.`);
                }
            }
            keys.forEach(() => {
                this.get_callback(key, (err, value) => {
                    (DEBUG && err) && this.log.log(`[redis-client] saveServer fail.`);
                    r[key] = value;
                    saveFile();
                });
            });
        });
    }

    _loadServer(__jsonFilePath = `${__path}/saved/redisdb.json`) {
        fs.readFile(__jsonFilePath, (err, text) => {
            const json = JSON.parse(text);
            if (json && Object.keys(json).length > 0) {
                json.forEach((value, key) => this.set(key, json));
                this.log.log(`[redis-client] ${__jsonFilePath} loaded.`);
            }
        })
    }

    _openClient(port) {
        const redis = require("redis");
        if (this.usingPromise) bluebird.promisifyAll(redis.RedisClient.prototype);

        this.client = redis.createClient(port);
        this.log.log(`[redis-client] try to connect ${port}`);
        this.client.on("error", err => {
            this.log.log(`[redis-server] connect failed in port ${port} : ${err}`);
        });
    }
}