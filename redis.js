const redis = require('redis');
const redisUrl = 'redis://128.0.0.1:6379';
const client = redis.createClient(redisUrl);

client.set('hi', 'there');
client.get('hi', (err,val)=>{

    console.log(val);
})
