const Favourite = require("./favorite");
const db = require("../utils/databaseutil");
module.exports = class Home {
  constructor(id, houseName, imageUrl, price, location, rating, description) {
    this.houseName = houseName;
    this.imageUrl = imageUrl;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.description = description;
    this.id = id;
  }

  save() {
    if (this.id) {
      //update
      return db.execute(
        `UPDATE homes 
     SET houseName = ?, imageUrl = ?, price = ?, location = ?, rating = ?, description = ?
     WHERE id = ?`,
        [
          this.houseName,
          this.imageUrl,
          this.price,
          this.location,
          this.rating,
          this.description,
          this.id,
        ]
      );
    } else {
      // insert
      return db.execute(
        "INSERT INTO homes(houseName,price,location,imageUrl,rating,description)values(? ,? ,? ,? ,? ,? )",
        [
          this.houseName,
          this.price,
          this.location,
          this.imageUrl,
          this.rating,
          this.description,
        ]
      );
    }
  }

  static fetchAll() {
    return db.execute("SELECT * FROM homes");
  }
  static findById(homeId) {
    return db.execute("SELECT * FROM homes WHERE id =?", [homeId]);
  }

  static deleteById(homeId) {
    return db.execute("DELETE FROM homes WHERE id =?", [homeId]);
  }
  
};
