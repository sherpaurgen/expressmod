const mongoose = require('mongoose');
mongoose.pluralize(null); //this will prevent default pluralize collection name eg. user -to users

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', UserSchema)

//collection with name "users"  is saved by default...NOT "user"..
//const dataSchema = new Schema({..}, { collection: 'data' })
