var express = require('express');
require('custom-env').env(true)
const port = process.env.port;
const router = require('./router/router');

// Create an express server and a GraphQL endpoint
var app = express();

app.use('/', router);

var server = app.listen(port, () => {
  console.log(`App running on port ${port}.`);
})
