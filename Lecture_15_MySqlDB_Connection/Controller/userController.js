const Favourite = require("../Model/favorite");
const Home = require("../Model/home");

exports.getIndex = (req, resp, next) => {
   Home.fetchAll().then(([registeredHomes]) => {
    resp.render("User/index", {
        registeredHomes: registeredHomes,
        title: "airbnb-index",
        currentPage: "home",
      });
   }).catch((err) => {
    console.log(err);
    
   });
  // (registeredHomes) => {
  //   const favourites = Favourite.getFavourites((favourites) => {
  //     resp.render("User/index", {
  //       registeredHomes: registeredHomes,
  //       favourites: favourites,
  //       title: "airbnb-index",
  //       currentPage: "home",
  //     });
  //   });
  // };
};

exports.getBookings = (req, resp, next) => {
  resp.render("User/bookings", {
    title: "airbnb-user-bookings",
    currentPage: "booking",
  });
};

exports.getFavorite = (req, resp, next) => {
  Home.fetchAll((registeredHomes) => {
    Favourite.getFavourites((favourites) => {
      const favouriteHomesData = registeredHomes.filter((home) =>
        favourites.includes(String(home.id))
      );
      resp.render("User/favorite", {
        homes: favouriteHomesData,
        favourites,
        title: "airbnb-user-favourites",
        currentPage: "favorite",
      });
    });
  });
};

exports.getHomeDetails = (req, resp) => {
  let homeId = req.params.homeId;

  Home.findById(homeId).then(([homes]) => {
    const home = homes[0];
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
  const registeredHomes = Home.fetchAll().then(([registeredHomes])=>{
      resp.render("User/home-list", {
        registeredHomes: registeredHomes,
        title: "airbnb-user-home",
        currentPage: "home-list",
      });
    
  });
};

// exports.getHome = (req, resp, next) => {
//   const registeredHomes = Home.fetchAll().then(([registeredHomes])=>{
//     Favourite.getFavourites((favourites) => {
//       resp.render("User/home-list", {
//         registeredHomes: registeredHomes,
//         favourites: favourites,
//         title: "airbnb-user-home",
//         currentPage: "home-list",
//       });
//     });
//   });
// };

exports.postAddToFavorite = (req, resp, next) => {
  console.log("Came to add to favorite ", req.body);
  Favourite.toggle(req.body.id, (err) => {
    if (err) {
      console.log("Error while marking favourites ");
    }
    resp.redirect("/favorite");
  });
};
exports.postRemoveFromFavorite = (req, resp, next) => {
  const homeId = req.params.homeId;
  Favourite.deleteById(homeId, (err) => {
    if (err) {
      console.log("Error occur remove from favourites: ", err);
    }
    resp.redirect("/favorite");
  });
};
