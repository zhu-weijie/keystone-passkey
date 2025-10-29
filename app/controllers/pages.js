// app/controllers/pages.js
class PagesController {
  welcome(req, res) {
    res.render('pages/welcome');
  }
}

module.exports = new PagesController();
