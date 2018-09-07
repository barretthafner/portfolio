import path from 'path';
import express from 'express';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import compression from 'compression';
// import fs from 'fs';

import { ip, port } from '../config'; // env,



// create express app
const app = express();



// Use Helmet - security package
app.use(helmet());

// Use gzip compression
app.use(compression());


// serve built app and favicon
const publicPath = path.resolve(__dirname, '../build');
app.use(express.static(publicPath));
app.use(favicon(publicPath + '/static/favicon.ico'));



// response parsers
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(cookieParser());



// Router
app.get('*', function(req,res) {
	res.sendFile(publicPath + '/index.html');
});



// error handler
app.use(function(err, req, res) {
	console.error(err.stack);
	res.status(err.status || 500).send('Something broke!');
});



// Start app
app.listen(port, ip, function() {
	console.log('Server listening at: ' + ip + ':' + port);
});



export default app;
