var mongoose = require('mongoose');
var articleSchema = require('../schemas/commentSchema');


var commentModel = mongoose.model('commentModel', commentSchema);

module.exports = commentModel;


