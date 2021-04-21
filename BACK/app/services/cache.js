const redis = require('./redis');

// la mémoire qui manque à Redis, pour retenir toutes les clés utilisées dans le contexte de ce cache
const keysIndex = [];

const cache = {
    add: async (key, value) => {
        // on retient que maintenant, cette clé est utilisée
        keysIndex.push(key);
        await redis.set(key, JSON.stringify(value));
    },

    check: (key) => {
        // includes vérifie si un élément est présent dans un array
        return keysIndex.includes(key);
    },

    get: async (key) => {
        return await redis.get(key).then(JSON.parse);
    },

    // avec invalidation temporelle
    // ttl = time to live
    addTemporarily: async (key, value, ttl) => {
        // on retient que maintenant, cette clé est utilisée
        keysIndex.push(key);
        await redis.setex(key, ttl, JSON.stringify(value));
    },

    // flush supprime instantanément TOUTES les données en cache
    flush: async () => {
        for (const key of keysIndex) {
            await redis.del(key);

            delete keysIndex[key];
        }
    }
};

module.exports = cache;