var config = require('config-lite');
var mongoose = require('mongoose');
mongoose.connect(config.mongodb);

exports.userSchema = new mongoose.Schema({
    name: String,
    password: String,
    avatar: String,
    gender: { type: String, enum: ['m', 'f', 'x'] },
    bio: { type: String }
});
