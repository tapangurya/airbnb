const Home = require("../Model/home");
const Favourite = require("../Model/favorite");

exports.getAddHome = (req, resp, next) => {
  resp.render("Admin/add-home", {
    title: "airbnb-admin-add-home",
    currentPage: "addHome",
  });
};

exports.postAddHome = (req, res, next) => {
  const { houseName, imageUrl, price, location, rating, description } =
    req.body;
  const home = new Home({
    houseName,
    imageUrl,
    price,
    location,
    rating,
    description,
  });
  home
    .save()
    .then(() => {
      console.log("Data Saved successfully: ");
      res.render("Admin/homeAdded", {
        title: "airbnb-admin-home-added",
        currentPage: "addedHome",
      });
    })
    .catch((err) => {
      console.error("Error whiling add home: ", err);

      res.status(500).send("Database error");
    });
};

exports.getHomeList = (req, resp, next) => {
  const registeredHomes = Home.find()
    .then((registeredHomes) => {
      resp.render("Admin/admin-home-list", {
        registeredHomes: registeredHomes,
        title: "airbnb-admin-home-list",
        currentPage: "adminHomeList",
      });
    })
    .catch((err) => {
      console.log("Error while getHomeList", err);
    });
};

exports.getEditHome = (req, resp, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  console.log("your edit home id ", homeId, editing);

  Home.findById(homeId).then((home) => {
    if (!home) {
      return resp.redirect("/Admin/home-list");
    }
    resp.render("Admin/edit-home", {
      home: home,
      title: "airbnb-admin-edit-home",
      currentPage: "adminHomeList",
      editing: editing,
    });
  });
};
exports.postEditHome = (req, resp, next) => {
  const { id, houseName, imageUrl, price, location, rating, description } =
    req.body;
  Home.findById(id)
    .then((home) => {
      home.houseName = houseName;
      home.imageUrl = imageUrl;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;
      home.save().then((result) => {
        console.log("Home updated", result);
      });
      resp.redirect("/admin/home-list");
    })
    .catch((err) => {
      console.log("Error whiling edit post home : ", err);
    });
};

exports.postDeleteHome = (req, resp, next) => {
  const houseId = req.params.homeId;
  console.log("Your deleted home id: ", houseId);
 
  Home.findByIdAndDelete(houseId)
    .then(() => {
      resp.redirect("/admin/home-list");
    })
    .catch((err) => {
      console.log("error occured at deleted time ", err);
    });
};
