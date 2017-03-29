var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
    author: String,
    title: String,
    content: String,
    pv: Number
});

module.exports = articleSchema;