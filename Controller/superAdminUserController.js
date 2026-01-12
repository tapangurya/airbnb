const Users = require("../Model/users");
const logActivity = require("../utils/activityLogger");
const Home = require("../Model/home");
const fs = require('fs');
/* ===================== USERS ===================== */

/**
 * GET /superadmin/users
 * View all normal users
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await Users.find({ role: "user" }).sort({ createdAt: -1 });

    return res.render("SuperAdmin/manage-users", {
      title: "Manage Users",
      currentPage: "manage-users",
      users,
      user: req.session.superAdmin,
      isSuperAdminLoggedIn: true,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.redirect("/superadmin");
  }
};

/**
 * POST /superadmin/users/toggle/:id
 * Block / Unblock user
 */
exports.toggleBlockUser = async (req, res) => {
  try {
    const targetUser = await Users.findById(req.params.id);
    if (!targetUser) {
      return res.redirect("/superadmin/users");
    }

    targetUser.isBlocked = !targetUser.isBlocked;
    await targetUser.save();

    // ✅ ACTIVITY LOG
    await logActivity({
      actorType: "superadmin",
      actorId: req.session.superAdmin.id,
      action: targetUser.isBlocked ? "BLOCK_USER" : "UNBLOCK_USER",
      entityType: "Users",
      entityId: targetUser._id,
      description: `Super Admin ${
        targetUser.isBlocked ? "blocked" : "unblocked"
      } a user`,
    });

    return res.redirect("/superadmin/users");
  } catch (err) {
    console.error("Error toggling user:", err);
    return res.redirect("/superadmin/users");
  }
};

/* ===================== ADMINS ===================== */

/**
 * GET /superadmin/admins
 * View all admins
 */
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Users.find({ role: "admin" }).sort({ createdAt: -1 });
    return res.render("SuperAdmin/manage-admins", {
      title: "Manage Admins",
      currentPage: "manage-admins",
      admins,
      user: req.session.superAdmin,
      isSuperAdminLoggedIn: true,
    });
  } catch (err) {
    console.error("Error fetching admins:", err);
    return res.redirect("/superadmin");
  }
};

// GetAll admins home
exports.getAdminHomes = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Users.findById(adminId).select(
      "firstName lastName email"
    );
    if (!admin) {
      return res.redirect("/superadmin/admins");
    }

    const homes = await Home.find({ admin: adminId }).sort({
      createdAt: -1,
    });

    return res.render("SuperAdmin/admin-homes", {
      title: "Admin Homes",
      currentPage: "manage-admins",
      admin,
      homes,
      user: req.session.superAdmin,
      isSuperAdminLoggedIn: true,
    });
  } catch (error) {
    console.error("Error fetching admin homes:", error);
    return res.redirect("/superadmin/admins");
  }
};

exports.deleteHome = async (req, res) => {
  try {
    const { adminId, homeId } = req.params;

    const home = await Home.findById(homeId);
    if (!home) {
      return res.redirect(`/superadmin/admins/${adminId}/homes`);
    }

    // delete image file
    if (home.imageUrl) {
      fs.unlink(home.imageUrl, err => {
        if (err) console.error("Image delete error:", err);
      });
    }

    await Home.findByIdAndDelete(homeId);

    return res.redirect(`/superadmin/admins/${adminId}/homes`);
  } catch (error) {
    console.error("Error deleting home:", error);
    return res.redirect("/superadmin/admins");
  }
};
/**
 * POST /superadmin/admins/toggle/:id
 * Block / Unblock admin
 */
exports.toggleBlockAdmin = async (req, res) => {
  try {
    if (!req.session?.superAdmin) {
      return res.redirect("/superadmin/super-login");
    }

    const targetAdmin = await Users.findById(req.params.id);

    if (!targetAdmin || targetAdmin.role !== "admin") {
      return res.redirect("/superadmin/admins");
    }

    // ❌ Prevent self-block
    if (targetAdmin._id.toString() === req.session.superAdmin.id) {
      return res.redirect("/superadmin/admins");
    }

    targetAdmin.isBlocked = !targetAdmin.isBlocked;
    await targetAdmin.save();

    await logActivity({
      actorType: "superadmin",
      actorId: req.session.superAdmin.id,
      action: targetAdmin.isBlocked ? "BLOCK_ADMIN" : "UNBLOCK_ADMIN",
      entityType: "Users",
      entityId: targetAdmin._id,
      description: `Super Admin ${
        targetAdmin.isBlocked ? "blocked" : "unblocked"
      } an admin`,
    });

    return res.redirect("/superadmin/admins");
  } catch (err) {
    console.error("Error toggling admin:", err);
    return res.redirect("/superadmin/admins");
  }
};

