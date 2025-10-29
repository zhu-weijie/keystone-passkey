// config/routes.js
const express = require('express');
const router = express.Router();

// Import the controller
const pagesController = require('../app/controllers/pages');
const authController = require('../app/controllers/auth');

// Use the controller's 'welcome' method for the root route
router.get('/', pagesController.welcome);

router.get('/register', authController.register);
router.get('/login', authController.login);

module.exports = router;
