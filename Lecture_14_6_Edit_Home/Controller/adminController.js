const Home = require("../Model/home");

exports.getAddHome = (req, resp, next) => {
  resp.render("Admin/add-home", {
    title: "airbnb-admin-add-home",
    currentPage: "addHome",
  });
};

exports.postAddHome = (req, resp, next) => {
  const { houseName, imageUrl, price, location, rating } = req.body;
  const home = new Home(houseName, imageUrl, price, location, rating);
  home.save();
  resp.render("Admin/homeAdded", {
    title: "airbnb-admin-home-added",
    currentPage: "addedHome",
  });
};

exports.getHomeList = (req, resp, next) => {
  const registeredHomes = Home.fetchAll((registeredHomes) => {
    resp.render("Admin/admin-home-list", {
      registeredHomes: registeredHomes,
      title: "airbnb-admin-home-list",
      currentPage: "adminHomeList",
    });
  });
};

exports.getEditHome = (req, resp, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === 'true';

  console.log("your edit home id ", homeId,editing);

  Home.findById(homeId, (home) => {
    if (!home) {
      return resp.redirect("/Admin/home-list"); 
    } 
      resp.render("Admin/edit-home", {
        home: home,
        title: "airbnb-admin-edit-home",
        currentPage: "adminHomeList",
        editing:editing,
      });
  });
};
exports.postEditHome = (req, resp, next) => {
  const {id,houseName, imageUrl, price, location, rating} = req.body;
  const home  = new Home(houseName, imageUrl, price, location, rating)
  home.id =id;
  home.save()
  resp.redirect("/admin/home-list");

};


exports.postDeleteHome = (req, resp, next) => {
  const homeId = req.params.homeId;
  console.log("your deleted home id: ",homeId);
  Home.deleteById(homeId,err=>{
    if(err){
      console.log("error occured at deleted time ",err);
      
    }
    resp.redirect("/admin/home-list");
  })
  
};