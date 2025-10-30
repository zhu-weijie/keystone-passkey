// app/controllers/auth.js
const base64url = require('base64url');
const { v4: uuid } = require('uuid');
class AuthController {
  register(req, res) {
    res.render('auth/register');
  }

  login(req, res) {
    res.render('auth/login');
  }

  createChallenge(store) {
    return (req, res, next) => {
      // The user object contains the user's email (name) and a randomly generated,
      // unique handle (id), which is required by the WebAuthn API.
      const user = {
        id: uuid({}, Buffer.alloc(16)),
        name: req.body.email,
        displayName: req.body.email
      };

      // Use the store to generate a challenge. The user object is passed
      // to associate this challenge with the user being registered.
      store.challenge(req, { user: user }, (err, challenge) => {
        if (err) { return next(err); }

        // The user handle and challenge must be sent to the client as base64url encoded strings.
        user.id = base64url.encode(user.id);

        res.json({
          user: user,
          challenge: base64url.encode(challenge),
        });
      });
    };
  }

  getChallenge(store) {
    return (req, res, next) => {
      // Use the store to generate a new challenge for this session.
      store.challenge(req, (err, challenge) => {
        if (err) { return next(err); }
        // Send the base64url encoded challenge to the client.
        res.json({ challenge: base64url.encode(challenge) });
      });
    };
  }

  // This runs on successful authentication
  loginSuccess(req, res, next) {
    // Passport's `req.login` establishes a session.
    req.login(req.user, (err) => {
      if (err) { return next(err); }
      // On success, respond with a JSON object indicating a redirect to the dashboard.
      res.json({ ok: true, destination: '/' });
    });
  }

  // This runs on a failed authentication
  loginFail(err, req, res, next) {
    const cxx = Math.floor(err.status / 100);
    if (cxx != 4) { return next(err); }
    // On failure, respond with a JSON object indicating a redirect back to the login page.
    res.json({ ok: false, destination: '/login' });
  }

  // New validation middleware
  validateCredential(req, res, next) {
    if (!req.body || !req.body.response) {
      // If the request body is missing the 'response' object, it's invalid.
      // Send a 400 Bad Request response and stop the chain.
      return res.status(400).json({ error: 'Invalid credential request body.' });
    }
    // If validation passes, proceed to the next middleware (Passport).
    next();
  }
}

module.exports = new AuthController();
