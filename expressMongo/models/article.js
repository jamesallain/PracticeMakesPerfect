var articleSchema = require('../lib/mongoose').articleSchema;
var mongoose = require('mongoose');

exports.articleModel = mongoose.model('articleModel', articleSchema);
