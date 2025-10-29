// app/controllers/admin.js
class AdminController {
  dashboard(req, res) {
    res.render('admin/dashboard', { user: req.user });
  }
}

module.exports = new AdminController();
