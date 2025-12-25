// External Module
const express = require("express");

const userRouter = express.Router();
//Local module
const userController = require('../Controller/userController');

userRouter.get("/",userController.getIndex);

userRouter.get("/booking",userController.getBookings);

userRouter.get("/favorite",userController.getFavorite);

userRouter.get("/reserve",userController.getReserve);

userRouter.get("/home-list",userController.getHome);
userRouter.get("/home/:homeId",userController.getHomeDetails);

userRouter.post("/favourite",userController.postAddToFavorite);
userRouter.post("/favourites/delete/:homeId",userController.postRemoveFromFavorite);

module.exports = userRouter;
