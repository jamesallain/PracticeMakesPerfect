module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/articles');
  });
  app.use('/signup', require('./signupRoute'));
  app.use('/signin', require('./signinRoute'));
  app.use('/signout', require('./signoutRoute'));
  app.use('/articles', require('./articleRoute'));
};