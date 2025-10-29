// config/routes.js
const express = require('express');
const router = express.Router();

// We will import controllers here later
router.get('/', (req, res) => {
  res.send('Hello from the router!');
});

module.exports = router;
