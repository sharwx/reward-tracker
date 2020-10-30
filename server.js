
// =======================================
//              DEPENDENCIES
// =======================================
require('dotenv').config()
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session')
const moment = require('moment')
const expenseControllers = require('./controllers/expenseControllers')
const UsersControllers = require('./controllers/UsersControllers')
const cardsControllers = require('./controllers/cardsControllers')
const app = express();
const port = 3000;

app.locals.moment = moment; // this makes moment available as a variable in every EJS page


// =======================================
//              MONGOOSE
// =======================================

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true);

// =======================================
//              EXPRESS
// =======================================
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({
  extended: true
}))

// session 
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: "app_session",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 3600000 }
}))

app.use(setUserVarMiddleware)

// =======================================
//              ROUTES
// =======================================


// INDEX Route
app.get('/expenses', authenticatedOnlyMiddleware, expenseControllers.listExpenses)

// NEW Route
app.get('/expenses/new', authenticatedOnlyMiddleware, expenseControllers.newExpenses)

// SHOW Route
app.get('/expenses/:slug', authenticatedOnlyMiddleware, expenseControllers.showExpenses)

// CREATE Route
app.post('/expenses', authenticatedOnlyMiddleware, expenseControllers.createExpenses)

// EDIT Route
app.get('/expenses/:slug/edit', authenticatedOnlyMiddleware, expenseControllers.editExpenses)

// UPDATE Route
app.patch('/expenses/:slug/', authenticatedOnlyMiddleware, expenseControllers.updateExpenses)


// DELETE Route
app.delete('/expenses/:slug/', authenticatedOnlyMiddleware, expenseControllers.deleteExpenses)

// USER REGISTER FORM Route
app.get('/users/register', guestOnlyMiddleware, UsersControllers.newUser)

// USER REGISTER Route
app.post('/users/register', guestOnlyMiddleware, UsersControllers.register)

// USER LOGIN FORM Route
app.get('/users/login', guestOnlyMiddleware, UsersControllers.loginUser)

// USER LOGIN Route
app.post('/users/login', guestOnlyMiddleware, UsersControllers.login)

// DASHBOARD Route
app.get('/', authenticatedOnlyMiddleware, UsersControllers.dashboard)

// DASHBBOARD LOGOUT Route
app.post('/users/logout', authenticatedOnlyMiddleware, UsersControllers.logout)

// CARD INDEX Route
app.get('/cards', authenticatedOnlyMiddleware, cardsControllers.listCards)

// CARD NEW Route
app.get('/cards/new', authenticatedOnlyMiddleware, cardsControllers.newCard)

// CARD SHOW Route
app.get('/cards/:slug', authenticatedOnlyMiddleware, cardsControllers.showCard)

// CARD CREATE Route
app.post('/cards', authenticatedOnlyMiddleware, cardsControllers.createCard)

// CARD DELETE Route
app.delete('/cards/:slug/', authenticatedOnlyMiddleware, cardsControllers.deleteCard)


// =======================================
//              LISTENER
// =======================================

mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(response => {
    console.log('DB connection successful')
    app.listen(process.env.PORT || port, () => {
      console.log(`Reward-Tracker app listening on port: ${port}`)
    })
  })
  .catch(err => {
    console.log(err)
})

function authenticatedOnlyMiddleware(req, res, next) {
  if ( ! req.session || ! req.session.user ) {
    res.redirect('/users/login')
    return
  }
  next()
}

function guestOnlyMiddleware(req, res, next) {
  if ( req.session && req.session.user) {
    res.redirect('/users/dashboard')
    return
  }
  next()
}

function setUserVarMiddleware(req, res, next) {
  res.locals.user = null

  if (req.session && req.session.user) {
    res.locals.user = req.session.user
  }

  next()
}


