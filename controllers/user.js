const env = process.env.NODE_ENV || 'development'
const config = require('../config/config')[env]

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const generateToken = data => {
    const token = jwt.sign(data, config.privateKey)

    return token
}

const saveUser = async (req, res) => {
    try {
        const { username, password } = req.body

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = new User({ username, password: hashedPassword })
        const userObj = await user.save()

        if (status) {
            const token = generateToken({ userID: userObj._id, username: userObj.username })
            res.cookie(config.cookie, token).cookie('username', username)
        }
        return token
    } catch (err) {
        return {
            error: true,
            message: err
        }
    }
}

const verifyUser = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username })

        if (!user) {
            return {
                error: true,
                message: 'There is no such user'
            }
        }
        const status = await bcrypt.compare(password, user.password)

        if (status) {
            const token = generateToken({ userID: user._id, username: user.username })
            res.cookie(config.cookie, token).cookie('username', username)
        }
        return {
            error: !status,
            message: status || 'Wrong password'
        }
    } catch (err) {
        return {
            error: true,
            message: 'There is no such user',
            status
        }
    }
}

const authAccess = (req, res, next) => {
    const token = req.cookies[config.cookie]

    if (!token) {
        return res.redirect('/login')
    }

    try {
        jwt.verify(token, config.privateKey)
        next()
    } catch (e) {
        return res.redirect('/')
    }
}

module.exports = {
    saveUser,
    verifyUser,
    authAccess,
}