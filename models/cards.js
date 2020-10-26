const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    bank_name: {
        type: String,
        required: true
    },
    card_name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    max_cap: {
        type: Number,
        required: true
    },
    img_url: {
        type: String
    }

})

const CardModel = mongoose.model('Card', cardSchema)

module.exports = CardModel