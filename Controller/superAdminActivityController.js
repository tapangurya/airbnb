const SystemActivity = require("../Model/SystemActivity");

/**
 * GET /superadmin/activity-log
 * View system-wide activity logs
 */
exports.getActivityLogs = async (req, res) => {
  try {
    
    const activities = await SystemActivity.find()
      .sort({ createdAt: -1 })
      .limit(200) 
      .lean();

    return res.render("SuperAdmin/activity-log", {
      title: "System Activity Log",
      currentPage: "activity-log",
      activities,
      user: req.session.superAdmin,
      isSuperAdminLoggedIn: true,
    });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return res.redirect("/superadmin");
  }
};
