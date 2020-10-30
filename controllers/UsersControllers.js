const uuid = require('uuid')
const SHA256 = require('crypto-js/sha256')
const UserModel = require('../models/users')

const UsersControllers = {

    newUser: (req, res) => {
        res.render('users/register', {
            pageTitle: 'Register'
        })
    },

    register: (req, res) => {
        if (req.body.username == "") {
            res.send('Enter username')
            return
        }

        if (req.body.email == "") {
            res.send('Enter email')
            return

        }

        if (req.body.password == "") {
            res.send('Enter password')
            return
        }

        UserModel.findOne({
            email: req.body.email
        })
            .then(result => {
                if (result) {
                    res.redirect('/users/register')
                    return
                }

                const salt = uuid.v4()
                const combination = salt + req.body.password
                const hash = SHA256(combination).toString()

                UserModel.create({
                    username: req.body.username,
                    email: req.body.email,
                    pwsalt: salt,
                    hash: hash
                })

                    .then(createResult => {
                        res.redirect('/')
                    })
                    .catch(err => {
                        res.redirect('/users/register')
                    })
            })
            .catch(err => {
                console.log(err)
                res.redirect('/users/register')
            })
    },

    loginUser: (req, res) => {
        res.render('users/login', {
            pageTitle: 'Log in'
        })
    },

    login: (req, res) => {
        if (req.body.email == "") {
            res.send('Enter email')
            return
        }

        if (req.body.password == "") {
            res.send('Enter password')
            return
        }

        UserModel.findOne({
            email: req.body.email
        })
            .then(result => {
                if (!result) {
                    console.log("err: no result")
                    res.redirect('/users/login')
                    return
                }

                const hash = SHA256(result.pwsalt + req.body.password).toString()

                if (hash !== result.hash) {
                    console.log("err: hash does not match")
                    res.redirect('/users/login')
                    return
                }

                req.session.user = result

                res.redirect('/')
            })
            .catch(err => {
                console.log(err)
                res.redirect('/users/login')
            })

    },

    dashboard: (req, res) => {

        res.render('users/dashboard', {
            pageTitle: 'Welcome!'
        })
    
    },

    logout: (req, res) => {
        req.session.destroy()
        res.render('users/logout', {
            pageTitle: 'Logout'
        })
    }


}


module.exports = UsersControllers