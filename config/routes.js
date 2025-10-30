// config/routes.js
const express = require('express');
const router = express.Router();
const SessionChallengeStore = require('passport-fido2-webauthn').SessionChallengeStore;

// Import the service
const passportService = require('../app/services/passport');

// Import the controller
const pagesController = require('../app/controllers/pages');
const authController = require('../app/controllers/auth');
const adminController = require('../app/controllers/admin');

// Instantiate the store
const store = new SessionChallengeStore();

// Initialize the Passport service with the challenge store
passportService.init(store);

// 1. `pagesController.welcome` runs first. If it renders a page, the chain stops.
// 2. If it calls `next()`, `adminController.dashboard` runs.
router.get('/', pagesController.welcome, adminController.dashboard);
router.get('/register', authController.register);
router.get('/login', authController.login);
router.post('/register/public-key/challenge', authController.createChallenge(store));
router.post('/login/public-key/challenge', authController.getChallenge(store));

module.exports = router;
