#!/usr/bin/env node

/**
 * Module dependencies.
 */

import {app} from '../app';
import {serverPort, proxyPort, socketPort} from '../config';
import * as http from 'http';
import proxy = require("../proxy");
import io = require("../socket");

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(serverPort);
// console.log('Server on port', port);
app.set('port', port);

// const port2 = normalizePort(proxyPort);
// console.log('Proxy on port', port2);
// proxy.listen(port2);
//
// const port3 = normalizePort(socketPort);
// console.log('Socket on port', port3);
// io.listen(port3);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val): boolean | number {

  const normalizedPort = parseInt(val, 10);

  if (isNaN(normalizedPort)) {
    // named pipe
    return val;
  }

  if (normalizedPort >= 0) {
    // port number
    return normalizedPort;
  }

  return false;
}

/**
 * Event listener for HTTP server 'error' event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server 'listening' event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
