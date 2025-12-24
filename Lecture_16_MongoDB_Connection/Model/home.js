const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/databaseutil");
module.exports = class Home {
  constructor(_id, houseName, imageUrl, price, location, rating, description) {
    this.houseName = houseName;
    this.imageUrl = imageUrl;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.description = description;
    if (_id) {
      this._id = _id;
    }
  }

  save() {
    const db = getDb();
    if (this._id) {
      const updateObj = {
        houseName: this.houseName,
        imageUrl: this.imageUrl,
        price: this.price,
        location: this.location,
        rating: this.rating,
        description: this.description,
      };
      return db
        .collection("homes")
        .updateOne({ _id: new ObjectId(String(this._id)) }, { $set: updateObj });
    } else {
      return db.collection("homes").insertOne(this);
    }
  }

  static fetchAll() {
    const db = getDb();
    return db.collection("homes").find().toArray();
  }
  static findById(homeId) {
    const db = getDb();
    return db
      .collection("homes")
      .find({ _id: new ObjectId(String(homeId)) })
      .next();
  }

  static deleteById(homeId) {
    const db = getDb();
    return db
      .collection("homes")
      .deleteOne({ _id: new ObjectId(String(homeId)) });
  }
};
