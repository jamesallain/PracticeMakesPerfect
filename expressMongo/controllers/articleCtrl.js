var mongoose = require('mongoose')
var articleModel = require('../models/articleModel')

exports.save = function(req, res, data) {
    var article = new articleModel(data);
    article.save(function(err, article) {
        if (err) {
            console.log(err)
        }
        req.flash('success', '发表成功');
        // 发表成功后跳转到该文章页
        res.redirect(`/article/${article._id}`);
    });
}
