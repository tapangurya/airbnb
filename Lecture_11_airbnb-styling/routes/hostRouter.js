//Core module
const path = require('path');

//Local Module
const rootPath = require('../utils/pathutil');

//External module
const express = require('express');
const hostRouter = express.Router();

hostRouter.get('/add-home', (req, resp, next) => {
  resp.sendFile(path.join(rootPath, 'views', 'addHome.html'));
});
const homeDetails =[];
hostRouter.post('/add-home', (req, resp, next) => {
  homeDetails.push(req.body)
  console.log(homeDetails);
  resp.sendFile(path.join(rootPath, 'views', 'homeAdded.html'));
});
module.exports = hostRouter;
