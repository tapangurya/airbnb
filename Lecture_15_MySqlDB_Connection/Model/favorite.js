
module.exports = class Favourite {
  static addToFavourite(homeId, callback) {

    Favourite.getFavourites((favourites) => {
      
    });
  }



  static getFavourites(callback) {
    
  }

  static deleteById(delHomeId, callback) {
    
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
