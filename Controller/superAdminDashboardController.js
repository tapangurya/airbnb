const Users = require("../Model/users");
const Home = require("../Model/home");
const Booking = require("../Model/book");
const SystemActivity = require("../Model/SystemActivity");




exports.getDashboard = async (req, res) => {
  try {
    // ===== COUNTS =====
    const totalUsers = await Users.countDocuments({ role: "user" });
    const totalAdmins = await Users.countDocuments({ role: "admin" });
    const totalHomes = await Home.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // ===== RECENT ACTIVITIES =====
    const recentActivities = await SystemActivity.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: "actorId",
        select: "firstName lastName email",
      })
      .lean();
    console.log("Recent ACTIVITIES",recentActivities);
    const userDetails = await Users.findById()

    return res.render("SuperAdmin/dashboard", {
      title: "Super Admin Dashboard",
      currentPage: "superAdmin-dashboard",
      isSuperAdminLoggedIn: true,
      user: req.session.superAdmin,

      // Dashboard data
      totalUsers,
      totalAdmins,
      totalHomes,
      totalBookings,
      recentActivities,
    });
  } catch (error) {
    console.error("Error loading super admin dashboard:", error);
    return res.status(500).render("500", {
      title: "Server Error",
      isSuperAdminLoggedIn: true,
      user: req.session.superAdmin,
    });
  }
};
