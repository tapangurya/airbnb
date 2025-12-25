const mongoose = require("mongoose");
const favorite = require("./favorite");
const houseSchema = new mongoose.Schema({
  houseName: { type: String, required: true },
  price: { type: Number, required: true,min:0},
  location: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  imageUrl: { type: String, required: true },
  description: String,
});

houseSchema.pre('findOneAndDelete', async function() {
  const homeId = this.getQuery()._id;
  console.log("i AM INSIDE HOME MODEL : ID ",homeId);
  
  await favorite.deleteMany({houseId:homeId});
  
})
module.exports = mongoose.model("Home", houseSchema);

