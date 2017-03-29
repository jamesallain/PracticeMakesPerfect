module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/article');
  });
  app.use('/signup', require('./signupRoute'));
  app.use('/signin', require('./signinRoute'));
  app.use('/signout', require('./signoutRoute'));
  app.use('/article', require('./articleRoute'));
};