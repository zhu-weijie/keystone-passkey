// app/controllers/pages.js
class PagesController {
  welcome(req, res) {
    res.send('Welcome to Keystone!');
  }
}

module.exports = new PagesController();
