const _ = require('lodash')
const moment = require('moment')
const ExpenseModel = require('../models/expense')
const CardModel = require('../models/cards')
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const expenseControllers = {

    listExpenses: (req, res) => {
        
        ExpenseModel.find()
            .then(results => {
                res.render('expense/index', {
                    pageTitle: 'Expense Tracker',
                    expense: results,
                })
            })
    },

    newExpenses: (req, res) => {
        res.render('expense/new',{
            pageTitle: 'Create new item'
        })
    },

    showExpenses: (req, res) => {
        let slug = req.params.slug

        ExpenseModel.findOne({
            slug: slug
        })
            .then(result => {
                if (! result) {
                    res.redirect('/expenses')
                    return
                }
                res.render('expense/show', {
                    pageTitle: "Show Expenses",
                    item: result,
                    date: moment(result.date).format("D MMM YY"),
                    price: Number(result.amount).toFixed(2)
                })
            })
            .catch(err => {
                res.send(err)
            })
    },

    createExpenses: (req, res) => {
        const slug = _.kebabCase(req.body.description)
        let date = new Date(req.body.date)

        ExpenseModel.create({
            date: date.getUTCFullYear() + " " + monthNames[date.getMonth()] + " " + date.getDate(),
            description: req.body.description,
            slug: slug,
            amount: parseInt(req.body.amount),
            payment_mthd: req.body.payment_mthd,
            category: req.body.category,
            remarks: req.body.remarks
        })
            .then(results => {
                res.redirect('/expenses/' + slug)
            })
            .catch(err => {
                console.log(err)
                res.redirect('/expenses/new')
            })
    },

    editExpenses: (req, res) => {

        ExpenseModel.findOne({
            slug: req.params.slug
        })
            .then(result => {
                res.render('expense/edit', {
                    pageTitle: "Edit for " + result.description,
                    item: result,
                    itemID: result.slug
        
                })
            })
            .catch(err => {
                res.redirect('/expenses')
            })
    },

    updateExpenses: (req, res) => {
        const newSlug = _.kebabCase(req.body.description)
        let date = new Date(req.body.date)

        ExpenseModel.findOne({
            slug: req.params.slug
        })
            .then(result => {
                ExpenseModel.update({
                    slug: req.params.slug
                },{
                    date: date.getUTCFullYear() + " " + monthNames[date.getMonth()] + " " + date.getDate(),
                    description: req.body.description,
                    slug: newSlug,
                    amount: parseInt(req.body.amount),
                    payment_mthd: req.body.payment_mthd,
                    category: req.body.category,
                    remarks: req.body.remarks
                })
                    .then(updateResult => {
                        res.redirect('/expenses/' + newSlug)
                    })
                    .catch(err => {
                        console.log(err)
                        res.redirect('/expenses')
                    })
            })
            .catch(err => {
                console.log(err)
                res.redirect('/expenses')
            })
    },

    deleteExpenses: (req, res) => {

        ExpenseModel.findOne({
            slug: req.params.slug
        })
            .then(result => {

                ExpenseModel.deleteOne({
                    slug: req.params.slug
                })
                    .then(deleteResult => {
                        res.redirect('/expenses')
                    })
                    .catch(err => {
                        console.log(err)
                        res.redirect('/expenses')
                    })
            })
            .catch(err => {
                console.log(err)
                res.redirect('/expenses')
            })
    }


}


module.exports = expenseControllers