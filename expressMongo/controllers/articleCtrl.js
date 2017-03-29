var mongoose = require('mongoose');
var articleModel = require('../models/articleModel');

module.exports = {
    // 创建一篇文章
    save: function(req, res, data) {
        var article = new articleModel(data);
        article.save(function(err, article) {
            if (err) {
                console.log(err)
            }
            req.flash('success', '发表成功');
            // 发表成功后跳转到该文章页
            res.redirect(`/articles/${article._id}`);
        });
    },

    // 通过文章 id 获取一篇文章
    getArticleById: function getArticleById(articleId) {
        return articleModel
            .findOne({ _id: articleId })
            .populate({ path: 'author', model: 'user' })
            // .addCreatedAt()
            // .afterFindOne()
            .exec();
    },

    // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
    getArticles: function getArticles(author) {
        var query = {};
        if (author) {
            query.author = author;
        }
        return articleModel
            .find(query)
            .populate({ path: 'author', model: 'user' })
            .sort({ _id: -1 })
            // .addCreatedAt()
            // .afterFind()
            .exec();
    },

    // 通过文章 id 给 pv 加 1
    incPv: function incPv(articleId) {
        return articleModel
            .update({ _id: articleId }, { $inc: { pv: 1 } })
            .exec();
    },
    // 通过文章 id 获取一篇原生文章（编辑文章）
    getRawArticleById: function getRawArticleById(articleId) {
        return articleModel
            .findOne({ _id: articleId })
            .populate({ path: 'author', model: 'user' })
            .exec();
    },

    // 通过用户 id 和文章 id 更新一篇文章
    updateArticleById: function updateArticleById(articleId, author, data) {
        return articleModel.update({ author: author, _id: articleId }, { $set: data }).exec();
    },

    // 通过用户 id 和文章 id 删除一篇文章
    delArticleById: function delArticleById(articleId, author) {
        return articleModel.remove({ author: author, _id: articleId }).exec();
    }
};
