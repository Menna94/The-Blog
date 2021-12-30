const mongoose = require('mongoose');
// const keys = require('./keys');
const mongoURI = 'mongodb+srv://menna:menna1234@cluster0.rdkjx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const connectDB = async() =>{
    await mongoose.connect(mongoURI, {
        useUnifiedTopology:true,
        useNewUrlParser:true,
    });

    // console.log(`DB Connected: ${conn.connection.host}`.magenta.bold);
}

module.exports = connectDB;