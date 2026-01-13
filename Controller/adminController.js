//* Core Module
const fs = require("fs");
//* Local Module
const Home = require("../Model/home");
const Booking = require("../Model/book");
const logActivity = require("../utils/activityLogger");
const Users = require('../Model/users');
exports.getAddHome = (req, resp, next) => {
  resp.render("Admin/add-home", {
    title: "airbnb-admin-add-home",
    currentPage: "add-home",
    isLoggedIn: req.session.isLoggedIn,
    errors: req.session.errors || [],
    user: req.session.user,
  });
};

exports.postAddHome = async (req, res, next) => {
  try {
    const { houseName, price, location, rating, description } = req.body;

    if (!req.file) {
      req.session.errors = ["Image not provided"];
      return res.status(422).redirect("/Admin/add-home");
    }
    if (req.session.user.isBlocked) {
      req.session.errors = ["You are blocked"];
      return res.redirect("/admin/home-list");
    }
    const imageUrl = req.file.path;

    const home = new Home({
      houseName,
      price,
      location,
      rating,
      description,
      imageUrl,
      admin: req.session.user.id,
    });

    await home.save();


    await logActivity({
      actorType: "admin",
      actorId: req.session.user.id,
      action: "CREATE_HOME",
      entityType: "Home",
      entityId: home._id,
      description: "Admin created a new home",
    });

    return res.render("Admin/homeAdded", {
      title: "airbnb-admin-home-added",
      currentPage: "add-home",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  } catch (err) {
    console.error("Error while add home:", err);
    return res.status(500).send("Database error");
  }
};

exports.getHomeList = async (req, resp, next) => {
  try {
    const adminId = req.session.user.id;
    const registeredHomes = await Home.find({ admin: adminId });
    return resp.status(200).render("Admin/admin-home-list", {
      registeredHomes,
      title: "airbnb-admin-home-list",
      currentPage: "admin-home-list",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  } catch (error) {
    console.log("Error while getHomeList", error);
    return next(error);
  }
};

exports.getEditHome = async (req, res) => {
  if (req.session.user.isBlocked) {
      req.session.errors = ["You are blocked"];
      return res.redirect("/admin/home-list");
    }
  const homeId = req.params.homeId;
  const isEditing = req.query.editing === "true";

  if (!isEditing) {
    return res.redirect("/");
  }
  const dbUser = await Users.findById(req.session.user.id).select("isBlocked");
  if (!dbUser || dbUser.isBlocked) {
    return res.redirect("/admin/home-list");
  }
  const home = await Home.findById(homeId);
  if (!home) {
    return res.redirect("/");
  }

  res.render("Admin/edit-home", {
    title: "Edit Home",
    currentPage: "add-home",
    home,
    editing: isEditing,
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.getBookingRequests = async (req, res) => {
  try {

    if (!req.session.user || req.session.user.role !== "admin") {
      return res.redirect("/login");
    }
    if (req.session.user.isBlocked) {
      req.session.errors = ["You are blocked"];
      return res.redirect("/admin/home-list");
    }

    const adminId = req.session.user.id;
    const adminHomes = await Home.find({ admin: adminId }).select("_id");
    const homeIds = adminHomes.map((h) => h._id);

    const bookings = await Booking.find({ home: { $in: homeIds } })
      .populate("user", "firstName lastName email phone")
      .populate("home");

    res.render("Admin/booking-requests", {
      title: "Booking Requests",
      currentPage: "booking-requests",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
      bookings,
    });
  } catch (error) {
    console.error("Error while fetching booking requests:", error);
    res.redirect("/");
  }
};

//
exports.postApproveBooking = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== "admin") {
      
      return res.redirect("/login");
    }

    const bookingId = req.body.id; // ✅ FIX

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.redirect("/Admin/booking-requests");
    }

    booking.status = "confirmed";
    await booking.save();
    await logActivity({
      actorType: "admin",
      actorId: req.session.user.id,
      action: "APPROVE_BOOKING",
      entityType: "Booking",
      entityId: bookingId,
      description: "Admin approved booking",
    });

 

    return res.redirect("/Admin/booking-requests");
  } catch (error) {
    console.error("Error approving booking:", error);
    return res.redirect("/");
  }
};

exports.postRejectBooking = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== "admin") {
      return res.redirect("/login");
    }

    const bookingId = req.body.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.redirect("/Admin/booking-requests");
    }

    booking.status = "cancelled";
    await booking.save();
    await logActivity({
      actorType: "admin",
      actorId: req.session.user.id,
      action: "REJECT_BOOKING",
      entityType: "Booking",
      entityId: bookingId,
      description: "Admin rejected booking",
    });

    

    return res.redirect("/Admin/booking-requests");
  } catch (error) {
    console.error("Error approving booking:", error);
    return res.redirect("/Admin/home-list");
  }
};

exports.postEditHome = async (req, resp, next) => {
  try {
    if (req.session.user.isBlocked) {
      req.session.errors = ["You are blocked"];
      return res.redirect("/admin/home-list");
    }
    const { id, houseName, price, location, rating, description } = req.body;
    const home = await Home.findById(id);
    console.log(home.imageUrl);

    if (!home) {
      return resp.status(404).redirect("/Admin/home-list");
    }
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.description = description;
    if (req.file) {
      console.log(req.file.path);
      // delete old image
      fs.unlink(home.imageUrl, (err) => {
        if (err) {
          console.log("Error while deleting old image:", err);
        }
      });
      home.imageUrl = req.file.path;
    }
    await home.save();
    await logActivity({
      actorType: "admin",
      actorId: req.session.user.id,
      action: "EDIT_HOME",
      entityType: "Home",
      entityId: home._id,
      description: "Admin edited home details",
    });
    return resp.redirect("/Admin/home-list");
  } catch (err) {
    console.log("Error while editing home:", err);
    resp.status(500).redirect("/Admin/home-list");
  }
};

exports.postDeleteHome = async (req, resp, next) => {
  try {
    if (req.session.user.isBlocked) {
      req.session.errors = ["You are blocked"];
      return resp.redirect("/admin/home-list");
    }
    const houseId = req.params.homeId;
    console.log("Your deleted home id:", houseId);

    const home = await Home.findById(houseId);
    if (!home) {
      return resp.status(404).redirect("/Admin/home-list");
    }

    // delete image file if exists
    if (home.imageUrl) {
      fs.unlink(home.imageUrl, (err) => {
        if (err) {
          console.log("Error while deleting image:", err);
        }
      });
    }

    await Home.findByIdAndDelete(houseId);
    await logActivity({
      actorType: "admin",
      actorId: req.session.user.id,
      action: "DELETE_HOME",
      entityType: "Home",
      entityId: houseId,
      description: "Admin deleted a home",
    });

    return resp.redirect("/Admin/home-list");
  } catch (error) {
    console.log("Error occurred while deleting home:", error);
    return resp.status(500).redirect("/Admin/home-list");
  }
};
