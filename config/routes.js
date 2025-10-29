// config/routes.js
const express = require('express');
const router = express.Router();

// Import the controller
const pagesController = require('../app/controllers/pages');
const authController = require('../app/controllers/auth');
const adminController = require('../app/controllers/admin');

// 1. `pagesController.welcome` runs first. If it renders a page, the chain stops.
// 2. If it calls `next()`, `adminController.dashboard` runs.
router.get('/', pagesController.welcome, adminController.dashboard);

router.get('/register', authController.register);
router.get('/login', authController.login);

module.exports = router;
