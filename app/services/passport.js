// app/services/passport.js
const passport = require('passport');
const WebAuthnStrategy = require('passport-fido2-webauthn');
const db = require('../../db/init');
const { User, PublicKeyCredentials } = require('../models');

class PassportService {
  init(store) {
    // The WebAuthn strategy will be configured here.
    // passport.use(new WebAuthnStrategy(...));

    // Serialization and deserialization functions will be defined here.
    // passport.serializeUser(...);
    // passport.deserializeUser(...);
  }
}

module.exports = new PassportService();
