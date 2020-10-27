const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    payment_mthd: {
        type: String,
        required: true
    },
    card_slug: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    remarks: {
        type: String
    }

})

const ExpenseModel = mongoose.model('Expense', expenseSchema)

module.exports = ExpenseModel