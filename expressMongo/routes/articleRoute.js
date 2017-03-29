var express = require('express');
var router = express.Router();
var articleCtrl = require('../controllers/articleCtrl');
var checkLogin = require('../middlewares/check').checkLogin;

// GET /articles 所有用户或者特定用户的文章页
//   eg: GET /articles?author=xxx
router.get('/', function(req, res, next) {
    res.render('article');
});

// POST /articles 发表一篇文章
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

// GET /articles/:postId 单独一篇的文章页
router.get('/:articleId', function(req, res, next) {
    res.send(req.flash());
});

// GET /articles/:postId/edit 更新文章页
router.get('/:articleId/edit', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// POST /articles/:postId/edit 更新一篇文章
router.post('/:articleId/edit', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// GET /articles/:postId/remove 删除一篇文章
router.get('/:articleId/remove', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// POST /articles/:postId/comment 创建一条留言
router.post('/:articleId/comment', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// GET /articles/:postId/comment/:commentId/remove 删除一条留言
router.get('/:articleId/comment/:commentId/remove', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

module.exports = router;
