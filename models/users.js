const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        max: 50,
        min: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 100
    },
    pwsalt: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    }

})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel