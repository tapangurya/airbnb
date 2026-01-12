
const express = require("express");
const superAdmin = express.Router();

/* ===== Controllers ===== */

const superAdminAuthController = require("../Controller/superAdminController");
const dashboardController = require("../Controller/superAdminDashboardController");
const userController = require("../Controller/superAdminUserController");
const activityController = require("../Controller/superAdminActivityController");


/* ===================== AUTH ===================== */
superAdmin.get("/index",  superAdminAuthController.getIndex);
// Login
superAdmin.get("/super-login", superAdminAuthController.getLogin);
superAdmin.post("/super-login", superAdminAuthController.postLogin);

// Register
superAdmin.get("/super-signup", superAdminAuthController.getRegister);
superAdmin.post("/super-signup", superAdminAuthController.postRegister);

// Logout
superAdmin.post("/logout",superAdminAuthController.postLogout);

/* ===================== DASHBOARD ===================== */

// superAdmin.get("/index",  dashboardController.getIndex);
superAdmin.get("/dashboard",  dashboardController.getDashboard);

/* ===================== USER MANAGEMENT ===================== */

// Users
superAdmin.get("/users",  userController.getUsers);
superAdmin.post(
  "/users/toggle/:id",
 
  userController.toggleBlockUser
);

// Admins
superAdmin.get("/admins", userController.getAdmins);
superAdmin.post(
  "/admins/toggle/:id",

  userController.toggleBlockAdmin
);

// Admin homes
superAdmin.get(
  "/admins/:adminId/homes",

  userController.getAdminHomes
);

superAdmin.post(
  "/admins/:adminId/homes/delete/:homeId",

  userController.deleteHome
);

/* ===================== ACTIVITY LOG ===================== */

superAdmin.get(
  "/activity-log",
  activityController.getActivityLogs
);

module.exports = superAdmin;
