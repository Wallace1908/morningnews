const mongoose = require('mongoose')

const wishlistSchema = mongoose.Schema({
    title: String,
    content: String,
    urlToImage: String
})

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    token: String,
    userArticles : [wishlistSchema]
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel