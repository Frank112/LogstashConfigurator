const config = {};
const fs = require('fs');
const path = require('path');

const systemConfFile = fs.readFileSync(path.join(__dirname, '..', '..', 'systemConf.json'));
const systemConf = JSON.parse(systemConfFile);

config.redisStore = {
    url: systemConf.redis_store_uri,
    secret: systemConf.redis_store_secret
};

// Parse users
if(!systemConf.users || systemConf.users.length === 0)
    console.error('Missing users in system configuration.');
else
    config.users = systemConf.users;


module.exports = config;
