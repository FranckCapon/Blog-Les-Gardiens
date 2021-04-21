const { createClient } = require('redis');

const client = createClient();

const { promisify } = require('util');

module.exports = {
    get: promisify(client.get).bind(client),
    set: promisify(client.set).bind(client),
    exists: promisify(client.exists).bind(client)
};