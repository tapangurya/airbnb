// External Module
const express = require("express");

const userRouter = express.Router();
//Local module
const userController = require('../Controller/userController');

userRouter.get("/",userController.getIndex);

userRouter.get("/booking",userController.getBookings);

userRouter.get("/favorite",userController.getFavorite);

userRouter.get("/home-details",userController.getHomeDetails);

userRouter.get("/reserve",userController.getReserve);

userRouter.get("/home-list",userController.getHome);



module.exports = userRouter;
