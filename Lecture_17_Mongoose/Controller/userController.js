const Favourite = require("../Model/favorite");
const Home = require("../Model/home");

exports.getIndex = async (req, resp, next) => {
  try {
    const registeredHomes = await Home.find();
    const favourites = await Favourite.find();
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
}

exports.getBookings = (req, resp, next) => {
  resp.render("User/bookings", {
    title: "airbnb-user-bookings",
    currentPage: "booking",
  });
}
/*
exports.getFavorite = async (req, resp, next) => {
  try {
    const registeredHomes = await Home.find();
    const favourites = await Favourite.find();

    // extract only houseId as string
    const favouriteIds = favourites.map((f) => f.houseId.toString());

    const favouriteHomesData = registeredHomes.filter((home) =>
      favouriteIds.includes(home._id.toString())
    );

    resp.render("User/favorite", {
      homes: favouriteHomesData,
      favourites: favouriteIds,
      title: "airbnb-user-favourites",
      currentPage: "favorite",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
}
*/
exports.getFavorite = (req,resp,next)=>{
  Favourite.find().populate('houseId').then((favourites)=>{
    const favouriteHomesData = favourites.map((fav)=>fav.houseId)
    resp.render("User/favorite", {
      homes: favouriteHomesData,
      // favourites: favouriteHomesData,
      title: "airbnb-user-favourites",
      currentPage: "favorite",
    });

  })
}
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
  })
}

exports.getReserve = (req, resp, next) => {
  resp.render("User/reserve", {
    title: "airbnb-user-reserve",
    currentPage: "reserve",
  })
}

exports.getHome = (req, resp, next) => {
  const registeredHomes = Home.find()
    .then((registeredHomes) => {
      resp.render("User/home-list", {
        registeredHomes: registeredHomes,
        title: "airbnb-user-home",
        currentPage: "home-list",
      });
    })
    .catch((err) => console.log("Error while getHome (UserController)", err));
}

exports.postAddToFavorite = async (req, resp, next) => {
  try {
    console.log("Came to add to favorite", req.body);
    const homeId = req.body.id.toString();
    const existingFavorite = await Favourite.findOne({ houseId: homeId });
    
    if (!existingFavorite) {
      await Favourite.create({ houseId: homeId });
    }
    resp.redirect("/favorite");
  } catch (err) {
    console.error(err);
    next(err);
  }
}

exports.postRemoveFromFavorite = (req, resp, next) => {

  const houseId = req.params.homeId;
  Favourite.findOneAndDelete({ houseId })
    .then(() => resp.redirect("/favorite"))
    .catch((err) => {
      console.error(err);
      resp.status(500).send("Failed to delete favourite");
    })
}
