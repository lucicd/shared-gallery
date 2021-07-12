// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const debug = require('debug')('shg-app');

// Define root and index paths
const rootPath = path.join(__dirname, 'dist/shg');
const indexPath = path.join(rootPath, 'index.html');

// import the routing file to handle the default (index) route
var index = require('./server/routes/app')(indexPath);
const { applySourceSpanToExpressionIfNeeded } = require('@angular/compiler/src/output/output_ast');

// ... ADD CODE TO IMPORT YOUR ROUTING FILES HERE ... 
// const messageRoutes = require('./server/routes/messages');
// const contactRoutes = require('./server/routes/contacts');
// const documentsRoutes = require('./server/routes/documents');
const usersRoutes = require('./server/routes/users');
const imagesRoutes = require('./server/routes/images');


// Establish a connection to the mongo database.
mongoose.connect('mongodb://localhost:27017/shared-gallery',
  { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) {
      console.log('Connection failed: ' + err);
    }
    else {
      console.log('Connected to database!');
    }
  }
);

var app = express(); // create an instance of express

// Tell express to use the following parsers for POST data
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/images', express.static(path.join('server/images')));

app.use(cookieParser());

app.use(logger('dev')); // Tell express to use the Morgan logger

// Add support for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

// Tell express to use the specified director as the
// root directory for your web site
app.use(express.static(rootPath));

// Tell express to map the default route ('/') to the index route
// app.use('/', index.router);
app.use('/', index);

// ... ADD YOUR CODE TO MAP YOUR URL'S TO ROUTING FILES HERE ...
// app.use('/messages', messageRoutes);
// app.use('/contacts', contactRoutes);
// app.use('/documents', documentsRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/images', imagesRoutes);

// Tell express to map all other non-defined routes back to the index page
app.get('*', (req, res) => res.sendFile(indexPath));

// Define the port address and tell express to use this port
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Tell the server to start listening on the provided port
server.listen(port, function() {
  console.log('API running on localhost: ' + port)
});
