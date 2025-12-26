const express = require('express');
const authRouter = express.Router();
const authController = require("../Controller/authController");

authRouter.get("/login", authController.getLogin);
authRouter.post("/login",authController.postLogin)

authRouter.get("/register", authController.getRegister);
authRouter.post("/register",authController.postRegister);
authRouter.post("/logout",authController.postLogout)

exports.authRouter = authRouter;
