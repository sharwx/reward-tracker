require('dotenv').config()
const mongoose = require('mongoose')
const expenseList = require('../models/expenseList')
const ExpenseModel = require('../models/expense')
const cardList = require('../models/cardList')
const cardModel = require('../models/cards')

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`


// Seed Expenses

mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(response => {
    console.log('MongoDB connection successful')
  })
  .then(response => {
    ExpenseModel.insertMany(expenseList)
        .then(insertResponse => {
            console.log('Data seeding successful')
        })
        .catch(insertErr => {
            console.log(insertErr)
        })
        .finally(() => {
            mongoose.disconnect()
        })
  })
  .catch(err => {
    console.log(err)
  })



// Seed cards

  // mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )
  // .then(response => {
  //   console.log('MongoDB connection successful')
  // })
  // .then(response => {
  //   cardModel.insertMany(cardList)
  //       .then(insertResponse => {
  //           console.log('Data seeding successful')
  //       })
  //       .catch(insertErr => {
  //           console.log(insertErr)
  //       })
  //       .finally(() => {
  //           mongoose.disconnect()
  //       })
  // })
  // .catch(err => {
  //   console.log(err)
  // })