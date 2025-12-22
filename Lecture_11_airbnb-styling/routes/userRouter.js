//Core module
const path = require("path");
//Local Module
const rootPath = require('../utils/pathutil');

// External Module
const express = require("express");
const userRouter = express.Router();


userRouter.get("/", (req, resp, next) => {
  resp.sendFile(path.join(rootPath,'views', "home.html"));
});
module.exports = userRouter;
