
// External Module
const express = require("express");
const { registeredHomes } = require("./hostRouter");
const userRouter = express.Router();


userRouter.get("/", (req, resp, next) => {
  console.log(registeredHomes);
  resp.render("home", {registeredHomes: registeredHomes,title:"AirbnbHome",currentPage:"home"});
});
module.exports = userRouter;
