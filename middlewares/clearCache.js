const { clearHash } = require('../services/cache');

module.exports = async(req,res,next)=>{
    await next();
    //after the route handler finish running
    clearHash(req.user.id);
    console.log('cleaned');
}