const _ = require('lodash')
const CardModel = require('../models/cards')
const ExpenseModel = require('../models/expense')

const cardControllers = {

    listCards: (req, res) => {
        
        CardModel.find()

            .then(results => {
                res.render('cards/index', {
                    pageTitle: 'Cards Added',
                    cards: results,
                })
            })
    },

    newCard: (req, res) => {
        res.render('cards/new',{
            pageTitle: 'Add new card'
        })
    },

    showCard: (req, res) => {
        let slug = req.params.slug

        CardModel.findOne({
            slug: slug
        })
            .then(result => {
                if (! result) {
                    res.redirect('/cards')
                    return
                }

                res.render('cards/show', {
                    pageTitle: "Show Expenses",
                    item: result,
                })
            })
            .catch(err => {
                res.send(err)
            })
    },

    createCard: (req, res) => {
        const slug = _.kebabCase(req.body.card_name)

        CardModel.create({
            bank_name: req.body.bank_name,
            card_name: req.body.card_name,
            description: req.body.description,
            slug: slug,
            type: req.body.type,
            max_cap: parseInt(req.body.max_cap),
            img_url: req.body.img_url
        })
            .then(results => {
                res.redirect('/cards/' + slug)
            })
            .catch(err => {
                console.log(err)
                res.redirect('/cards/new')
            })
    },

    deleteCard: (req, res) => {

        CardModel.findOne({
            slug: req.params.slug
        })
            .then(result => {

                CardModel.deleteOne({
                    slug: req.params.slug
                })
                    .then(deleteResult => {
                        res.redirect('/cards')
                    })
                    .catch(err => {
                        console.log(err)
                        res.redirect('/cards')
                    })
            })
            .catch(err => {
                console.log(err)
                res.redirect('/cards')
            })
    }


}


module.exports = cardControllers