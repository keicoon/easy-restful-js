module.exports = class Log {
    constructor() {
        this.logs = new Array();
    }
    
    toString() {
        return this.logs;
    }

    log(...params) {
        this.logs.push(`[${new Date(Date.now()).toLocaleString()}] ${params.toString()}`);
        console.log.apply(console.log, params);
    }
}