require('newrelic');
const express = require('express');
const redis = require('redis');
const REDIS_PORT = 6380;
const redisClient = redis.createClient(REDIS_PORT);

const app = express();
const port = 3100;
const path = require('path');
const httpProxy = require('http-proxy');
// const apiProxy = httpProxy.createProxyServer();
const axios = require('axios');
var request = require('request');

app.use('/:id', express.static(path.join(__dirname)));

redisClient.on('error', (err) => {
  console.log("Error " + err);
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

const cacheHeader = (req, res, next) => {
  const { id } = req.params;
  redisClient.get((`${id}header`).toString(), (err, data) => {
    if (data != null) {
      res.send(data);
    } else {
      next();
    }
  });
};

const restaurantCache = (req, res, next) => {
  const id = req.params.id;
  redisClient.get((`${id}restCapacity`).toString(), (err, data) => {
    if (data != null) {
      res.send(data);
    } else {
      next();
    }
  });
}

const reservationCache = (req, res, next) => {
  const id = req.params.id;
  redisClient.get((`${id}reservation`).toString(), (err, data) => {
    if (data != null) {
      res.send(data);
    } else {
      next();
    }
  });
}

 var cacheImage = (req, res, next) => {
  const id = req.params.id;
  redisClient.get((`${id}image`).toString(), (err, data) => {
    if(data != null){
      res.send(data);
    } else {
      next();
    }
  })
};

app.get('/:id/header', cacheHeader, (req, res) => {
  axios.get(`http://18.188.246.230/${req.params.id}/header`)
  .then((data) => {
    redisClient.set((`${req.params.id}header`).toString(), JSON.stringify({ header: data.data.header, categories: data.data.categories, reviews: data.data.reviews }))
    res.send({ header: data.data.header, categories: data.data.categories, reviews: data.data.reviews });
  })
})

app.get('/:restaurantId/restaurantCapacity', restaurantCache, (req, res) => {
  const { restaurantId } = req.params;
  request(`http://54.183.216.157/${restaurantId}/restaurantCapacity`, (err, response, body) => { // ${reservation} is the variable that points to the IP my service is running on in AWS
    if (err) {
      console.log(err)
    } else {
      redisClient.set((`${restaurantId}restCapacity`).toString(), body);
      res.send(body);
    }
  });
});



app.get('/:restaurantId/reservation', reservationCache, (req, res) => {
  const { restaurantId } = req.params;
  const { timestamp } = req.query;
  request(`http://54.183.216.157/${restaurantId}/reservation?timestamp=${timestamp}`, (err, response, body) => {
    if (err) {
      console.log(err)
    } else {
      redisClient.set((`${restaurantId}reservation`).toString(), body)
      res.send(body);
    }
  });
});

app.get('/:id/gallery', cacheImage, (req, res) => {
  axios.get(`http://34.217.16.94/${req.params.id}/gallery`)
  .then((data)=>{
    redisClient.set((`${req.params.id}image`).toString(), data.data.rows)
    res.send(data.data);
  })
})

// app.all("/popular/:id", function(req, res) {
//   console.log('redirecting to popular');
//   apiProxy.web(req, res, {target: popular});
// });


app.listen(port, () => console.log(`listening on port ${port}`));
