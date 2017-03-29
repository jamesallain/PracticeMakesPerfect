var express = require('express');
var router = express.Router();
var articleCtrl = require('../controllers/articleCtrl');
var checkLogin = require('../middlewares/check').checkLogin;

// GET /articles 所有用户或者特定用户的文章页
//   eg: GET /articles?author=xxx
router.get('/', function(req, res, next) {
    var author = req.query.author;
    articleCtrl.getArticles(author)
        .then(function(articles) {
            res.render('articles', {
                articles: articles
            });
        })
        .catch(next);
});

// post /articles 发表一篇文章
router.post('/', checkLogin, function(req, res, next) {
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;

    // 校验参数
    try {
        if (!title.length) {
            throw new Error('请填写标题');
        }
        if (!content.length) {
            throw new Error('请填写内容');
        }
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var article = {
        author: author,
        title: title,
        content: content,
        pv: 0
    };
    articleCtrl.save(req, res, article);

});

// GET /articles/create 发表文章页
router.get('/create', checkLogin, function(req, res, next) {
    res.render('create');
});

// GET /articles/:articleId 单独一篇的文章页
router.get('/:articleId', function(req, res, next) {
    var articleId = req.params.articleId;
    Promise.all([
            articleCtrl.getArticleById(articleId), // 获取文章信息
            articleCtrl.incPv(articleId) // pv 加 1
        ])
        .then(function(result) {
            var article = result[0];
            if (!article) {
                throw new Error('该文章不存在');
            }

            res.render('article', {
                article: article
            });
        })
        .catch(next);
});

// GET /articles/:articleId/edit 更新文章页
router.get('/:articleId/edit', checkLogin, function(req, res, next) {
    var articleId = req.params.articleId;
    var author = req.session.user._id;

    articleCtrl.getRawArticleById(articleId)
        .then(function(article) {
            if (!article) {
                throw new Error('该文章不存在');
            }
            if (author.toString() !== article.author._id.toString()) {
                throw new Error('权限不足');
            }
            res.render('edit', {
                article: article
            });
        })
        .catch(next);
});

// post /articles/:articleId/edit 更新一篇文章
router.post('/:articleId/edit', checkLogin, function(req, res, next) {
    var articleId = req.params.articleId;
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;

    articleCtrl.updateArticleById(articleId, author, { title: title, content: content })
        .then(function() {
            req.flash('success', '编辑文章成功');
            // 编辑成功后跳转到上一页
            res.redirect(`/articles/${articleId}`);
        })
        .catch(next);
});

// GET /articles/:articleId/remove 删除一篇文章
router.get('/:articleId/remove', checkLogin, function(req, res, next) {
    var articleId = req.params.articleId;
    var author = req.session.user._id;
    articleCtrl.delArticleById(articleId, author)
        .then(function() {
            req.flash('success', '删除文章成功');
            // 删除成功后跳转到主页
            res.redirect('/articles');
        })
        .catch(next);
});

// post /articles/:articleId/comment 创建一条留言
router.post('/:articleId/comment', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// GET /articles/:articleId/comment/:commentId/remove 删除一条留言
router.get('/:articleId/comment/:commentId/remove', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

module.exports = router;
