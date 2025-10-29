// Import the express library
const express = require('express');

// Initialize the express application
const app = express();

// Define the port the server will run on.
// We use 3000 to match the port exposed in our Docker files.
const port = 3000;
// Define the host. '0.0.0.0' is important for Docker, as it tells the server
// to listen on all available network interfaces, not just localhost.
const host = '0.0.0.0';

// Define a simple route for the root URL ('/')
// When a GET request is made to this URL, it will respond with a simple string.
app.get('/', (req, res) => {
  res.send('Hello, Keystone!');
});

// Start the server and make it listen for connections on the specified port and host.
// A confirmation message is logged to the console once the server is running.
app.listen(port, host, () => {
  console.log(`Keystone server listening on http://${host}:${port}`);
});
