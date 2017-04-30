var mongoose = require('mongoose');
var commentModel = require('../models/commentModel');

module.exports = {
    // 创建一个留言
    save: function create(comment) {
        return commentModel.create(comment)
    },

    // 通过用户 id 和留言 id 删除一个留言
    delCommentById: function delCommentById(commentId, author) {
        return commentModel.remove({ author: author, _id: commentId })
    },

    // 通过文章 id 删除该文章下所有留言
    delCommentsByPostId: function delCommentsByPostId(postId) {
        return commentModel.remove({ postId: postId }).exec();
    },

    // 通过文章 id 获取该文章下所有留言，按留言创建时间升序
    getComments: function getComments(postId) {
        return commentModel
            .find({ postId: postId })
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: 1 })
    },

    // 通过文章 id 获取该文章下留言数
    getCommentsCount: function getCommentsCount(postId) {
        return commentModel.count({ postId: postId })
    }
};
