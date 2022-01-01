const mongoose = require('mongoose');
// const keys = require('./keys');
const keys = require('../config/keys');

const connectDB = async() =>{
    await mongoose.connect(keys.mongoURI, {
        useUnifiedTopology:true,
        useNewUrlParser:true,
    });

    // console.log(`DB Connected: ${conn.connection.host}`.magenta.bold);
}

module.exports = connectDB;