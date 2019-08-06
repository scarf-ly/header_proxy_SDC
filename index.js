require('newrelic');
const express = require('express');

const app = express();
const port = 3100;
const path = require('path');
const httpProxy = require('http-proxy');
const apiProxy = httpProxy.createProxyServer();

app.use('/:id', express.static(path.join(__dirname)));

// const gallery = 'http://ec2-52-53-207-161.us-west-1.compute.amazonaws.com:3000';
// const reservation = 'http://ec2-18-217-9-12.us-east-2.compute.amazonaws.com:3001';
// const popular = 'http://ec2-3-95-234-77.compute-1.amazonaws.com';
const header = 'http://ec2-3-14-71-98.us-east-2.compute.amazonaws.com:3003';

app.all("/:id/header", function(req, res) {
  // console.log('redirecting to header');
  apiProxy.web(req, res, {target: header});
});

// app.all("/reservation/:id", function(req, res) {
//     console.log('redirecting to reservation');
//     apiProxy.web(req, res, {target: reservation});
// });

// app.all("/gallery/:id", function(req, res) {
//     console.log('redirecting to gallery');
//     apiProxy.web(req, res, {target: gallery});
// });

// app.all("/popular/:id", function(req, res) {
//   console.log('redirecting to popular');
//   apiProxy.web(req, res, {target: popular});
// });


app.listen(port, () => console.log(`listening on port ${port}`));
