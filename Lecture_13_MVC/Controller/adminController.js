const Home = require('../Model/home')

exports.getAddHome = (req, resp, next) => {
  resp.render("Admin/add-home",{title:"airbnb-admin-add-home",currentPage:'addHome'})
};

exports.postAddHome = (req, resp, next) => {
  const {houseName,imageUrl,price,location,rating}= req.body;
  const home  = new Home(houseName,imageUrl,price,location,rating);
  home.save();
  resp.render("Admin/homeAdded",{title:"airbnb-admin-home-added",currentPage:'addedHome'})
}

exports.getEditHome = (req, resp, next) => {
  resp.render("Admin/edit-home",{title:"airbnb-admin-edit-home",currentPage:'edit-home'})
};
exports.getHomeList = (req, resp, next) => {
  const registeredHomes = Home.fetchAll((registeredHomes)=>{
    resp.render("Admin/admin-home-list",{registeredHomes: registeredHomes,title:"airbnb-admin-home-list",currentPage:'adminHomeList'})
  })
};