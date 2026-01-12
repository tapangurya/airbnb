// External Module
const express = require("express");

const userRouter = express.Router();
//Local module
const userController = require('../Controller/userController');

userRouter.get("/",userController.getIndex);

userRouter.get("/bookings",userController.getBookings);
// userRouter.post("/book-home",userController.postBookings);

userRouter.get("/favorite",userController.getFavorite);

userRouter.get("/reserve-home/:homeId",userController.getReserve);
userRouter.post("/reserve-home",userController.postReserve);

userRouter.get("/home-list",userController.getHome);
userRouter.get("/home/:homeId",userController.getHomeDetails);

userRouter.post("/favourite",userController.postAddToFavorite);
userRouter.post("/favourites/delete/:homeId",userController.postRemoveFromFavorite);


module.exports = userRouter;
