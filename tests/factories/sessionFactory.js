const Buffer = require('safe-buffer').Buffer;
const keys = require('../../config/keys');
const Keygrip = require('keygrip');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) =>{
    //create session base64 string using defined user id
    const sessionObject = {
        passport :{
            user : user._id.toString()
        }
    }
    
    const session = Buffer
                            .from(JSON.stringify(sessionObject)) //change session object into string
                            .toString("base64"); //turn it into base64 string
    //create session signature
    const sig = keygrip.sign('session='+ session);

    return{
        session,
        sig
    }

}