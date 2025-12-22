const Home = require('../Model/home')

exports.getIndex = (req, resp, next) => {
   const registeredHomes = Home.fetchAll((registeredHomes)=>{
    resp.render("User/index", {registeredHomes: registeredHomes,title:"airbnb-index",currentPage:"home"});
  });
};

exports.getBookings = (req, resp, next) => {
   resp.render("User/bookings", {title:"airbnb-user-bookings",currentPage:"booking"});
};

exports.getFavorite = (req, resp, next) => {
   const registeredHomes = Home.fetchAll((registeredHomes)=>{
    resp.render("User/favorite", {registeredHomes: registeredHomes,title:"airbnb-user-favorite",currentPage:"favorite"});
  });
};

exports.getHomeDetails = (req, resp, next) => {
   resp.render("User/home-details", {title:"airbnb-user-home-details",currentPage:"home-details"});
};

exports.getReserve = (req, resp, next) => {
   resp.render("User/reserve", {title:"airbnb-user-reserve",currentPage:"reserve"});
};

exports.getHome = (req, resp, next) => {
  const registeredHomes = Home.fetchAll((registeredHomes)=>{
    resp.render("User/home-list", {registeredHomes: registeredHomes,title:"airbnb-user-home",currentPage:"home-list"});
  });
};