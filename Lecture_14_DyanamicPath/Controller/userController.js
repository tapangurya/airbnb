const Favourite = require('../Model/favorite');
const Home = require('../Model/home')

exports.getIndex = (req, resp, next) => {
   const registeredHomes = Home.fetchAll((registeredHomes)=>{
    resp.render("User/index", {registeredHomes: registeredHomes ,Favourite:Favourite,title:"airbnb-index",currentPage:"home"});
  });
};

exports.getBookings = (req, resp, next) => {
   resp.render("User/bookings", {title:"airbnb-user-bookings",currentPage:"booking"});
};

exports.getFavorite = (req, resp, next) => {
   const registeredHomes = Home.fetchAll((registeredHomes)=>{
    const favouritesHome = Favourite.getFavourites((favouritesHome)=>{

       const favouriteHomesData = registeredHomes.filter(home=>favouritesHome.includes(home.id));
       resp.render("User/favorite",{homes:favouriteHomesData,title:"airbnb-user-favourites",currentPage:"favorite"});
    })
    
   })
};

exports.getHomeDetails = (req, resp) => {
  let homeId = req.params.homeId;
  
  Home.findById(homeId,home=>{
    if(!home){
      resp.redirect("/")
    }else{
        resp.render("User/home-details", {home:home, title:"airbnb-user-home-details",currentPage:"home",data:homeId}); 
    }
 })
  
  
};

exports.getReserve = (req, resp, next) => {
   resp.render("User/reserve", {title:"airbnb-user-reserve",currentPage:"reserve"});
};

exports.getHome = (req, resp, next) => {
  const registeredHomes = Home.fetchAll((registeredHomes)=>{
    resp.render("User/home-list", {registeredHomes: registeredHomes,Favourite:Favourite,title:"airbnb-user-home",currentPage:"home-list"});
  });
};


exports.postAddToFavorite = (req, resp, next) => {
  console.log("Came to add to favorite ",req.body);
  Favourite.addToFavourite(req.body.id,err=>{
    if(err){
        console.log("Error while marking favourites "); 
    }
    resp.redirect('/favorite');
    
  })
};