var mongoose = require('mongoose');
var usersSchema = require('../schemas/usersSchema');


var usersModel = mongoose.model('user', usersSchema);

module.exports = usersModel;
