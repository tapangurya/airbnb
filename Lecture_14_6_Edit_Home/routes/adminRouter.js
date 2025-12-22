
//External module
const express = require('express');
const adminRouter = express.Router();
//Local module
const adminController = require('../Controller/adminController');

adminRouter.get('/add-home',adminController.getAddHome );
adminRouter.post('/add-home',adminController.postAddHome );
adminRouter.get('/home-list',adminController.getHomeList );
adminRouter.get('/edit-home/:homeId',adminController.getEditHome );
adminRouter.post('/edit-home',adminController.postEditHome );
adminRouter.post('/delete-home/:homeId',adminController.postDeleteHome );
exports.adminRouter = adminRouter;
