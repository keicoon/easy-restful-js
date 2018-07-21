const config = {};
module.exports = {
    generateHashKey: (string) => {
        return 'hashKey';
    },
    setConfig: (key, value) => (config[key] = value),
    getConfig: (key) => (config[key])
}