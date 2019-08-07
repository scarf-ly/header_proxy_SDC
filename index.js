require('newrelic');
const express = require('express');

const app = express();
const port = 3100;
const path = require('path');
const httpProxy = require('http-proxy');
const apiProxy = httpProxy.createProxyServer();

app.use('/:id', express.static(path.join(__dirname)));

const gallery = 'http://ec2-34-217-16-94.us-west-2.compute.amazonaws.com';
const reservation = 'http://54.183.216.157';
// const popular = 'http://ec2-3-95-234-77.compute-1.amazonaws.com';
const header = 'http://ec2-18-188-246-230.us-east-2.compute.amazonaws.com';

app.all("/:id/header", function(req, res) {
  // console.log('redirecting to header');
  apiProxy.web(req, res, {target: header});
});

app.all(":id/reservation", function(req, res) {
    console.log('redirecting to reservation');
    apiProxy.web(req, res, {target: reservation});
});

app.all("/:id/gallery", function(req, res) {
    console.log('redirecting to gallery');
    apiProxy.web(req, res, {target: gallery});
});

// app.all("/popular/:id", function(req, res) {
//   console.log('redirecting to popular');
//   apiProxy.web(req, res, {target: popular});
// });


app.listen(port, () => console.log(`listening on port ${port}`));
