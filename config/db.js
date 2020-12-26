const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const connectDB = async () => {
    try {
        mongoose.connect(process.env.dbstring, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true });
        console.log('MongoDB connected...')
    }
    catch (err) {
        console.error(err.message);
        process.exit(1);
    }

}


// const connectDB = () => {
//     mongoose.connect('mongodb://demouser:nepal123#@127.0.0.1:27017/demo', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }).then(() => console.log('mongo connected')).catch(err => {
//         console.log(err.message)
//         process.exit(1)

//     });
// }
module.exports = connectDB;