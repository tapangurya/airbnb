const express = require('express');
const superAuthRouter = express.Router();
const superAuthController = require("../Controller/superAdminController");

superAuthRouter.get("/index",  superAuthController.getIndex);
// Login
superAuthRouter.get("/super-login", superAuthController.getLogin);
superAuthRouter.post("/super-login", superAuthController.postLogin);
// Register
superAuthRouter.get("/super-signup", superAuthController.getRegister);
superAuthRouter.post("/super-signup", superAuthController.postRegister);

// Logout
superAuthRouter.post("/logout",superAuthController.postLogout);

exports.superAuthRouter = superAuthRouter;