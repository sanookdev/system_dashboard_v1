// utils/cache.js
const NodeCache = require("node-cache");
const myCache = new NodeCache();

module.exports = {
    async set(key, value, ttl = 60) { myCache.set(key, value, ttl); },
    async get(key) { return myCache.get(key) || null; },
    async del(key) { myCache.del(key); },
};
