
//External module
const express = require('express');
const hostRouter = express.Router();

hostRouter.get('/add-home', (req, resp, next) => {

  resp.render("addHome",{title:"add-home",currentPage:'addHome'})
});


const registeredHomes =[];
hostRouter.post('/add-home', (req, resp, next) => {
  registeredHomes.push(req.body)
  resp.render("homeAdded",{title:"home-added",currentPage:'addedHome'})
});
exports.hostRouter = hostRouter;
exports.registeredHomes = registeredHomes;
