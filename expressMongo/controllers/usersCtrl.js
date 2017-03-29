var mongoose = require('mongoose');
var usersModel = require('../models/usersModel');
var path = require('path');
var sha1 = require('sha1');
var fs = require('fs');

exports.signin = function(req, res, name, password) {
    usersModel.findOne({ name: name }, 'name password', function(err, user) {
        if (err) {
            console.log(err);
        }
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('back');
        }
        // 检查密码是否匹配
        if (sha1(password) !== user.password) {
            req.flash('error', '用户名或密码错误');
            return res.redirect('back');
        }
        req.flash('success', '登录成功');
        // 用户信息写入 session
        delete user.password;
        req.session.user = user;
        // 跳转到主页
        res.redirect('/articles');
    })
}

exports.signup = function(req, res, user, fs, next) {
    // 用户信息写入数据库
    var user = new usersModel(user);

    user.save(function(err, result) {
        if (err) {
            // 注册失败，异步删除上传的头像
            fs.unlink(req.files.avatar.path);
            // 用户名被占用则跳回注册页，而不是错误页
            // if (e.message.match('E11000 duplicate key')) {
            req.flash('error', '用户名已被占用');
            return res.redirect('/signup');
            // }
            next();
        } else {
            console.log(result)
            req.session.user = result;
            // 写入 flash
            req.flash('success', '注册成功');
            // 跳转到首页
            res.redirect('/articles');
        }
    });
}
