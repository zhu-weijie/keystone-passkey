// Import the express library
const express = require('express');
const path = require('path');
const layouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./db/init');

// Initialize the express application
const app = express();

// Define the port the server will run on.
// We use 3000 to match the port exposed in our Docker files.
const port = process.env.PORT || 3000;
// Define the host. '0.0.0.0' is important for Docker, as it tells the server
// to listen on all available network interfaces, not just localhost.
const host = '0.0.0.0';

// --- Session Store Setup ---
const sessionStore = new SequelizeStore({
  db: db,
});

// --- Body Parsers & Form Data Middleware ---
// Parse JSON payloads
app.use(express.json());
// Parse URL-encoded payloads
app.use(express.urlencoded({ extended: false }));
// Parse cookie headers
app.use(cookieParser());
// Parse multipart/form-data. .none() means we are only accepting text fields.
app.use(multer().none());

// --- Session Middleware ---
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

// Sync the session store, creating the Sessions table if it doesn't exist
sessionStore.sync();

// --- EJS and Layouts Setup ---
app.use(layouts);
app.set('view engine', 'ejs');
// Tell Express where to find our views
app.set('views', path.join(__dirname, 'app/views'));
// Set the master layout file
app.set('layout', 'layouts/application');

// --- Static Assets ---
// This middleware serves files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Load the main router
app.use('/', require('./config/routes'));

// Start the server and make it listen for connections on the specified port and host.
// A confirmation message is logged to the console once the server is running.
app.listen(port, host, () => {
  console.log(`Keystone server listening on http://${host}:${port}`);
});
