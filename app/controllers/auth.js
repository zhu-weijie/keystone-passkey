// app/controllers/auth.js
class AuthController {
  register(req, res) {
    res.render('auth/register');
  }

  login(req, res) {
    res.render('auth/login');
  }
}

module.exports = new AuthController();
