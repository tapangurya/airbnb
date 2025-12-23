const Home = require("../Model/home");

exports.getAddHome = (req, resp, next) => {
  resp.render("Admin/add-home", {
    title: "airbnb-admin-add-home",
    currentPage: "addHome",
  });
};

exports.postAddHome = async (req, res, next) => {
  try {
    const { houseName, imageUrl, price, location, rating, description } =
      req.body;

    const home = new Home(
      null,
      houseName,
      imageUrl,
      price,
      location,
      rating,
      description
    );

    await home.save();

    res.render("Admin/homeAdded", {
      title: "airbnb-admin-home-added",
      currentPage: "addedHome",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
};

exports.getHomeList = (req, resp, next) => {
  const registeredHomes = Home.fetchAll().then(([registeredHomes]) => {
    resp.render("Admin/admin-home-list", {
      registeredHomes: registeredHomes,
      title: "airbnb-admin-home-list",
      currentPage: "adminHomeList",
    });
  });
};

exports.getEditHome = (req, resp, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  console.log("your edit home id ", homeId, editing);

  Home.findById(homeId).then(([homes]) => {
    const home = homes[0];
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
  const home = new Home(
    id,
    houseName,
    imageUrl,
    price,
    location,
    rating,
    description
  );
  
  home.save();
  resp.redirect("/admin/home-list");
};

exports.postDeleteHome = (req, resp, next) => {
  const homeId = req.params.homeId;
  console.log("your deleted home id: ", homeId);
  Home.deleteById(homeId)
    .then(() => {
      resp.redirect("/admin/home-list");
    })
    .catch((err) => {
      console.log("error occured at deleted time ", err);
    });
};
