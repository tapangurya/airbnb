const Favourite = require("../Model/favorite");
const Home = require("../Model/home");

exports.getIndex = async (req, resp, next) => {
  try {
    const registeredHomes = await Home.fetchAll();
    const favourites = await Favourite.getFavourites();
    resp.render("User/index", {
      registeredHomes,
      favourites,
      title: "airbnb-index",
      currentPage: "home",
    });
  } catch (err) {
    console.error(err);
    next(err); 
  }
};

exports.getBookings = (req, resp, next) => {
  resp.render("User/bookings", {
    title: "airbnb-user-bookings",
    currentPage: "booking",
  });
};

exports.getFavorite = async (req, resp, next) => {
  try {
    const registeredHomes = await Home.fetchAll();
    const favourites = await Favourite.getFavourites();
    console.log("All registered home: ",registeredHomes);
    console.log("all favourites home: ",favourites);

    const favouriteHomesData = registeredHomes.filter(home =>
      favourites.includes(home._id.toString())
    );

    resp.render("User/favorite", {
      homes: favouriteHomesData,
      favourites,
      title: "airbnb-user-favourites",
      currentPage: "favorite",
    });
  } catch (err) {
    console.error(err);
    next(err);
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
        currentPage: "home",
        data: homeId,
      });
    }
  });
};

exports.getReserve = (req, resp, next) => {
  resp.render("User/reserve", {
    title: "airbnb-user-reserve",
    currentPage: "reserve",
  });
};

exports.getHome = (req, resp, next) => {
  const registeredHomes = Home.fetchAll().then((registeredHomes) => {
    resp.render("User/home-list", {
      registeredHomes: registeredHomes,
      title: "airbnb-user-home",
      currentPage: "home-list",
    });
  });
};


exports.postAddToFavorite = (req, resp, next) => {
  console.log("Came to add to favorite", req.body);
  const homeId = req.body.id.toString();
  Favourite.toggle(homeId)
    .then((result) => {
      console.log("Favourite toggled:", result);
    })
    .catch((err) => {
      console.log("Error while adding to favourites:", err);
    })
    .finally(() => {
      resp.redirect("/favorite");
    });
};


exports.postRemoveFromFavorite = (req, resp, next) => {
  Favourite.deleteById(req.body.id)
    .then(() => resp.redirect("/favorite"))
    .catch(err => {
      console.error(err);
      resp.status(500).send("Failed to delete favourite");
    });
};

