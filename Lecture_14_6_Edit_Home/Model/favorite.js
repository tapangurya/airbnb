const path = require("path");
const fs = require("fs");
const rootDir = require("../utils/pathutil");
const FavouriteDataPath = path.join(rootDir, "Data", "favourite.json");
// let registeredHomes =[];
module.exports = class Favourite {
  static addToFavourite(homeId, callback) {

    Favourite.getFavourites((favourites) => {
      if (favourites.includes(homeId)) {
        console.log("Home is already present in your favourite");
      } else {
        favourites.push(homeId);
        fs.writeFile(FavouriteDataPath, JSON.stringify(favourites), callback);
      }
    });
  }



  static getFavourites(callback) {
    fs.readFile(FavouriteDataPath, (err, data) => {
      callback(!err ? JSON.parse(data) : []);
    });
  }

  static deleteById(delHomeId, callback) {
    Favourite.getFavourites((homeIds) => {
      const updatedHomeIds = homeIds.filter((id) => id !== delHomeId);
      fs.writeFile(FavouriteDataPath, JSON.stringify(updatedHomeIds), callback);
    });
  }
  static toggle(homeId, callback) {
    this.getFavourites((homeIds) => {
      const id = homeId;

      let updatedIds;
      if (homeIds.includes(id)) {
        // remove
        updatedIds = homeIds.filter((h) => h !== id);
      } else {
        // add
        updatedIds = [...homeIds, id];
      }

      fs.writeFile(
        FavouriteDataPath,
        JSON.stringify(updatedIds),
        callback
      );
    });
  }

  static isFavourite(homeId, callback) {
    this.getFavourites((homeIds) => {
      callback(homeIds.includes(String(homeId)));
    });
  }
};
