var userSchema = require('../lib/mongoose').userSchema;
var mongoose = require('mongoose');

exports.userModel = mongoose.model('user', userSchema);

module.getUserByName = function(name) {
    return userModel
        .findOne({ name: name })
        
}
