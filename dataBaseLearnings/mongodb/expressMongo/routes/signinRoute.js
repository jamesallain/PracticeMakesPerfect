var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/usersCtrl');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signin 登录页
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('signin');
});

// POST /signin 用户登录
router.post('/', checkNotLogin, function(req, res, next) {
    var name = req.fields.name;
    var password = req.fields.password;
    userCtrl.signin(req, res, name, password, next);
});

module.exports = router;
