const Home = require("../Model/home");
const User = require("../Model/users");
const Booking = require("../Model/book");
const logActivity = require("../utils/activityLogger");
const {
  calculateTotalPrice,
  formatCurrency,
} = require("../utils/totalPriceUtils");
const book = require("../Model/book");

exports.getIndex = async (req, resp, next) => {
  try {
    const registeredHomes = await Home.find();
    resp.render("User/index", {
      registeredHomes,
      title: "airbnb-index",
      currentPage: "home",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
const mongoose = require("mongoose");

exports.getReserve = async (req, resp, next) => {
  try {
    const user = req.session.user;

    if (!user) {
      return resp.status(401).render("Auth/login", {
        title: "Login",
        currentPage: "login",
        isLoggedIn: false,
        errors: ["Please login first"],
        oldInput: { email: "" },
      });
    }

    const homeId = req.params.homeId;
    if (!mongoose.Types.ObjectId.isValid(homeId)) {
      return resp.redirect("/");
    }
    const home = await Home.findById(homeId);

    if (!home) {
      return resp.status(404).render("404", {
        title: "Not Found",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    }

    return resp.render("User/reserve", {
      home,
      title: "airbnb-reserve-home",
      currentPage: "bookings",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error in getBookings:", error);
    return next(error);
  }
};

exports.postReserve = async (req, res) => {
  try {
    const sessionUser = req.session.user;
    const {
      homeId,
      pricePerNight,
      checkIn,
      checkOut,
      rooms,
      adults,
      children,
      fullname,
      email,
      phone,
    } = req.body;

    const totalPrice = calculateTotalPrice(
      checkIn,
      checkOut,
      Number(pricePerNight),
      Number(rooms)
    );

    const home = await Home.findById(homeId);
    if (!home) throw new Error("Home not found");

    const booking = new Booking({
      user: sessionUser.id,
      home: home._id,
      checkInDate: new Date(checkIn),
      checkOutDate: new Date(checkOut),
      pricePerNight: Number(pricePerNight),
      totalPrice,
      fullname,
      email,
      phone,
      rooms: Number(rooms),
      guests: {
        rooms: Number(rooms),
        adult: Number(adults),
        children: Number(children),
      },
    });

    const savedBooking = await booking.save();
    const DBuser = await User.findById(sessionUser.id);
    DBuser.bookings.push(savedBooking._id);
    await DBuser.save();
    await logActivity({
      actorType: "user",
      actorId: sessionUser.id,
      action: "CREATE_BOOKING",
      entityType: "Booking",
      entityId: savedBooking._id,
      description: "User created a booking",
    });

    console.log("Booking saved and linked to user");

    return res.redirect("/bookings");
  } catch (error) {
    console.error("Error during booking:", error);
    return res.redirect("/");
  }
};

exports.getHomeDetails = (req, resp) => {
  let homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    console.log("Home id is ", homeId);

    if (!home) {
      resp.redirect("/");
    } else {
      resp.render("User/home-details", {
        home: home,
        title: "airbnb-user-home-details",
        currentPage: "home-list",
        data: homeId,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    }
  });
};

exports.getBookings = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    let bookings = await Booking.find({
      user: req.session.user.id,
    }).populate("home");

    bookings = bookings.filter(b => b.home);

    res.render("User/bookings", {
      title: "airbnb-user-booked-home",
      currentPage: "bookings",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
      bookings,
    });
  } catch (error) {
    console.error("Error while get bookings:", error);
    res.redirect("/home-list");
  }
};

exports.getHome = (req, resp, next) => {
  const registeredHomes = Home.find()
    .then((registeredHomes) => {
      resp.render("User/home-list", {
        registeredHomes: registeredHomes,
        title: "airbnb-user-home",
        currentPage: "home-list",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch((err) => console.log("Error while getHome (UserController)", err));
};

exports.getFavorite = async (req, resp, next) => {
  const userId = req.session.user.id;
  const user = await User.findById(userId).populate("favourites");
  resp.render("User/favorite", {
    homes: user.favourites,
    title: "airbnb-user-favourites",
    currentPage: "favorite",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddToFavorite = async (req, resp, next) => {
  const user = req.session.user;
  if (!user) {
    req.session.errors = ["Please login first"];
    return resp.status(401).redirect("/login");
  }
  try {
    const homeId = req.body.id.toString();
    const userId = req.session.user.id;
    const user = await User.findById(userId);
    if (!user.favourites.includes(homeId)) {
      user.favourites.push(homeId);
      await user.save();
      await logActivity({
        actorType: "user",
        actorId: userId,
        action: "ADD_FAVORITE",
        entityType: "Home",
        entityId: homeId,
        description: "User added home to favorites",
      });
    }
    resp.redirect("/favorite");
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.postRemoveFromFavorite = async (req, resp, next) => {
  try {
    const houseId = req.params.homeId;
    const userId = req.session.user.id;

    const user = await User.findById(userId);

    user.favourites = user.favourites.filter(
      (favId) => favId.toString() !== houseId
    );

    await user.save();
    await logActivity({
        actorType: "user",
        actorId: userId,
        action: "REMOVE_FAVORITE",
        entityType: "Home",
        entityId: houseId,
        description: "User added home to favorites",
      });
    resp.redirect("/favorite");
  } catch (err) {
    console.error(err);
    resp.status(500).send("Failed to remove favourite");
  }
};
