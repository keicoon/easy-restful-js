module.exports = class Log {
    constructor() {
        this.logs = new Array();
    }
    
    toString() {
        return this.logs;
    }

    log(...params) {
        this.logs.push(`[${Date.now()}]`, params);
        console.log.call(console.log, params);
    }
}