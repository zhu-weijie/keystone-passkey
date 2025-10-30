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

  /**
   * The 'verify' callback for the WebAuthn strategy.
   * This function is called when a user attempts to log in.
   *
   * @param {string} id - The credential's external ID (base64url encoded).
   * @param {Buffer} userHandle - The user handle from the authenticator.
   * @param {function} done - The callback to signal completion.
   */
  async verify(id, userHandle, done) {
    try {
      // 1. Find the credential in the database by its external ID.
      const cred = await PublicKeyCredentials.findOne({ where: { external_id: id } });

      if (!cred) {
        return done(null, false, { message: 'Invalid key.' });
      }

      // 2. Find the user associated with that credential.
      const user = await User.findOne({ where: { id: cred.user_id } });

      if (!user) {
        return done(null, false, { message: 'No such user.' });
      }

      // 3. Security Check: Compare the user handle from the authenticator with the one
      // stored for the user. They must match.
      if (Buffer.compare(user.handle, userHandle) !== 0) {
        return done(null, false, { message: 'Handles do not match.' });
      }

      // 4. If all checks pass, signal success to Passport.
      // Return the user and their stored public key. Passport will use the
      // public key to cryptographically verify the authenticator's signature.
      return done(null, user, cred.public_key);
    } catch (error) {
      return done(error);
    }
  }

  /**
   * The 'register' callback for the WebAuthn strategy.
   * This function is called when a new credential is created.
   *
   * @param {object} user - User information from the authenticator (e.g., name).
   * @param {string} id - The credential's external ID (base64url encoded).
   * @param {string} publicKey - The public key (PEM format).
   * @param {function} done - The callback to signal completion.
   */
  async register(user, id, publicKey, done) {
    // Use a transaction to ensure that both the user and their key are created successfully.
    // If either step fails, the entire transaction will be rolled back.
    const transaction = await db.transaction();
    try {
      // Create a new user in the database.
      const newUser = await User.create({
        email: user.name, // The strategy provides the email in the 'name' field.
        handle: user.id,  // The user handle provided by the challenge.
      }, { transaction });

      if (!newUser) {
        return done(null, false, { message: 'Could not create user.' });
      }

      // Create the public key credential associated with the new user.
      const newCredential = await PublicKeyCredentials.create({
        user_id: newUser.id,
        external_id: id,
        public_key: publicKey,
      }, { transaction });

      if (!newCredential) {
        return done(null, false, { message: 'Could not create public key credential.' });
      }

      // If both records were created successfully, commit the transaction.
      await transaction.commit();

      // Signal to Passport that registration was successful, returning the new user object.
      return done(null, newUser);
    } catch (error) {
      // If any error occurred, roll back the transaction.
      await transaction.rollback();
      // Signal an error to Passport.
      return done(error);
    }
  }
}

module.exports = new PassportService();
