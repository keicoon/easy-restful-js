const _global = {};
module.exports = {
    generateHashKey: (string) => {
        return 'hashKey';
    },
    set: (key, value) => (_global[key] = value),
    get: (key) => (_global[key])
}