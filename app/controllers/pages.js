// app/controllers/pages.js
class PagesController {
  welcome(req, res, next) {
    // If there is no user on the request object, they are a guest.
    // Render the welcome page and stop.
    if (!req.user) {
      return res.render('pages/welcome');
    }
    // If there is a user, they are authenticated.
    // Pass control to the next middleware in the chain.
    next();
  }
}

module.exports = new PagesController();
