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

hostRouter.post('/add-home', (req, resp, next) => {
  console.log(req.body);
  resp.sendFile(path.join(rootPath, 'views', 'homeAdded.html'));
});
module.exports = hostRouter;
