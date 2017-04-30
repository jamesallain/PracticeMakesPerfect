var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    author: { type: Mongolass.Types.ObjectId },
    content: { type: 'string' },
    postId: { type: Mongolass.Types.ObjectId }
});

module.exports = commentSchema;
