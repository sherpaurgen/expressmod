const mongoose = require('mongoose');
mongoose.pluralize(null); //this will prevent default pluralize collection name eg. user -to users

const ContactSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
    },
    contactType: {
        type: String,
        default: 'personal'
    },
    date: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('contact', ContactSchema)
