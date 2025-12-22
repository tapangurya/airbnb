const path = require('path'); 
const fs = require('fs');
const rootDir = require('../utils/pathutil');
 const FavouriteDataPath =path.join(rootDir,"Data","favourite.json");
// let registeredHomes =[];
module.exports= class Favourite{
  static  addToFavourite(homeId,callback){
    Favourite.getFavourites((favourites)=>{
      if(favourites.includes(homeId)){
        console.log("Home is already present in your favourite");
      }
      else{
        favourites.push(homeId);
        fs.writeFile(FavouriteDataPath,JSON.stringify(favourites),callback);   
      }
    })

  }
  static getFavourites(callback){
    fs.readFile(FavouriteDataPath,(err,data)=>{
      callback(!err?JSON.parse(data):[]);
    })
  }
 static isFavourite(homeId, callback) {
  this.getFavourites((homeIds) => {
    const isFav = homeIds.includes(homeId);
    callback(isFav); // true or false
  });
}

};