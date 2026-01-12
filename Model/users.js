const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  phone: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
    },
  ],
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});

module.exports = mongoose.model("Users", usersSchema);
