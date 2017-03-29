var mongoose = require('mongoose');
var articleSchema = require('../schemas/articleSchema');


var articleModel = mongoose.model('articleModel', articleSchema);

module.exports = articleModel;
