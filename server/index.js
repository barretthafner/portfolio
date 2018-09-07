/**
 * Server
 * A entry point for the express server, allows us to use babel-register to use es7 serverside
 */

'use strict';
require('babel-register');
require('./server');
