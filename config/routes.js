// config/routes.js
const express = require('express');
const router = express.Router();

// Import the controller
const pagesController = require('../app/controllers/pages');

// Use the controller's 'welcome' method for the root route
router.get('/', pagesController.welcome);

module.exports = router;
