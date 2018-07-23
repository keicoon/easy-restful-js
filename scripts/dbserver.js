const util = require('./util.js');
const fs = require('fs');
const DEBUG = util.get('isdebug');
const log = util.get('log');

module.exports = class EasyRestfulDBServer {
    constructor(port) {
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

    get_callback(key, callback) {
        this.client.get(key, (err, reply) => {
            let result;
            if (reply == null) { err = "can find key"; }
            else { result = reply.toString(); }
            DEBUG && (err == null ? log.log(`[redis-client] get : ${result}`)
                : log.log(`[redis-client] get fail : ${key} -> ${err}`)
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
        this.client.set(key, value, (err, reply) => {
            DEBUG && (err == null ? log.log(`[redis-client] set : ${key} -> ${reply.toString()}`)
                : log.log(`[redis-client] set fail : ${key} -> ${err}`)
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
        log.log(`[redis-server] try to open ${port} ${bin}.`);
        if (bin === undefined) {
            log.log(`[redis-server] invalid bin path.`);
            return;
        } else {
            this.server = new RedisServer({ port, bin });
            this.server.open(err => {
                (err === null) ? log.log(`[redis-server] open success in port ${port}.`)
                    : log.log(`[redis-server] open failed in port ${port} : ${err}.`)
            })

            this._loadServer();
        }
    }

    _saveServer(__jsonFilePath = `${__dirname}/saved/redisdb.json`) {
        this.client.keys('*', (err, keys) => {
            var r = {};
            let savedKeyNum = 0;
            function saveFile() {
                if (++savedKeyNum >= keys.length) {
                    fs.writeFile(__jsonFilePath, JSON.stringify(r));
                    log.log(`[redis-client] ${__jsonFilePath} saved.`);
                }
            }
            keys.forEach(() => {
                this.get_callback(key, (err, value) => {
                    (DEBUG && err) && log.log(`[redis-client] saveServer fail.`);
                    r[key] = value;
                    saveFile();
                });
            });
        });
    }

    _loadServer(__jsonFilePath = `${__dirname}/../saved/redisdb.json`) {
        fs.readFile(__jsonFilePath, 'utf8', (err, text) => {
            const json = JSON.parse(text);
            if (json && Object.keys(json).length > 0) {
                json.forEach((value, key) => this.set(key, json));
                log.log(`[redis-client] ${__jsonFilePath} loaded.`);
            }
        })
    }

    _openClient(port) {
        if(this._isServerValid() == false) return;
        
        const redis = require("redis");
        if (this.usingPromise) bluebird.promisifyAll(redis.RedisClient.prototype);

        this.client = redis.createClient(port);
        log.log(`[redis-client] try to connect ${port}`);
        this.client.on("error", err => {
            log.log(`[redis-server] connect failed in port ${port} : ${err}`);
        });
    }
}