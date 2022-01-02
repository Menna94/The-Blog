const mongoose = require('mongoose');
const util = require('util');
const keys = require('../config/keys');

//redis configs
const redis = require('redis');
const client = redis.createClient(keys.redisUrl);
client.hget = util.promisify(client.hget);


const exec = mongoose.Query.prototype.exec;

//function that enable caching 
mongoose.Query.prototype.cache = function(options = {}){
    this._cache = true;
    this.hashKey = JSON.stringify(options.key || '');

    return this;
}

mongoose.Query.prototype.exec = async function(){
    if(!this._cache){
        return exec.apply(this, arguments);
    }

    const query = this.getQuery();
    const collectionName = this.mongooseCollection.name;

    const key = JSON.stringify(Object.assign({}, query, {
        collection : collectionName
    }))

    //check if we have a value for 'key' in redis
    //nested
    const cacheValue = await client.hget(this.hashKey, key);

    //if we do, return that
    if(cacheValue){
        console.log('from cache');
        const doc = JSON.parse(cacheValue)

        return Array.isArray(doc) 
            ? doc.map(d=> this.model(d))
            : new this.model(doc); 

    }
    //otherwise, issue the query & store the result in redis
    const result = await exec.apply(this, arguments);

    client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10, ()=>{});
    return result;
}

module.exports = {
    //delete data that is nesting under a given key
    clearHash(hashKey){
        client.del(JSON.stringify(hashKey));
    }
}