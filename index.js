// Import the express library
const express = require('express');
const path = require('path');
const layouts = require('express-ejs-layouts');

// Initialize the express application
const app = express();

// Define the port the server will run on.
// We use 3000 to match the port exposed in our Docker files.
const port = process.env.PORT || 3000;
// Define the host. '0.0.0.0' is important for Docker, as it tells the server
// to listen on all available network interfaces, not just localhost.
const host = '0.0.0.0';

// --- EJS and Layouts Setup ---
app.use(layouts);
app.set('view engine', 'ejs');
// Tell Express where to find our views
app.set('views', path.join(__dirname, 'app/views'));
// Set the master layout file
app.set('layout', 'layouts/application');

// Load the main router
app.use('/', require('./config/routes'));

// Start the server and make it listen for connections on the specified port and host.
// A confirmation message is logged to the console once the server is running.
app.listen(port, host, () => {
  console.log(`Keystone server listening on http://${host}:${port}`);
});
