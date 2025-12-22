
//External module
const express = require('express');
const adminRouter = express.Router();
//Local module
const adminController = require('../Controller/adminController');

adminRouter.get('/add-home',adminController.getAddHome );
adminRouter.post('/add-home',adminController.postAddHome );

adminRouter.get('/edit-home',adminController.getEditHome );
adminRouter.get('/home-list',adminController.getHomeList );

exports.adminRouter = adminRouter;
