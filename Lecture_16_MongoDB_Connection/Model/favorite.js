const { getDb } = require("../utils/databaseutil");

module.exports = class Favourite {
  constructor(homeId){
    this.id = homeId;
  }

  static toggle(houseId) {
    const db = getDb();
    const favCollection = db.collection("favourites");

    return favCollection.findOne({ houseId }).then(existing => {
      if (existing) {
        return favCollection.deleteOne({ houseId }).then(() => false);
      }
      return favCollection.insertOne({ houseId }).then(() => true);
    });
  }

  static deleteById(houseId) {
    const db = getDb();
    return db.collection("favourites").deleteOne({ houseId });
  }

  static getFavourites() {
    const db = getDb();
    return db
      .collection("favourites")
      .find()
      .toArray()
      .then(docs => docs.map(d => d.houseId.toString()));
  }

  static isFavourite(houseId) {
    const db = getDb();
    return db.collection("favourites").findOne({ houseId }).then(Boolean);
  }
};
