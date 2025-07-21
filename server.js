import http from 'http';
import app from './app/app.js';

// declare the port
const PORT = process.env.PORT || 4040;
// create server
const server = http.createServer(app);
server.listen(PORT, console.log(`Server is up and running on port ${PORT}!`));

