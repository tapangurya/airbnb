
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    fullname:{type:String,required:true},
    email:{type:String,required:true},
    phone: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded", "failed"],
      default: "unpaid",
    },
    transactionId: { type: String },
    rooms: { type: Number, required: true, default: 1, min: 1 },
    guests: {
      rooms: { type: Number, required: true, default: 1, min: 1 },
      adult: { type: Number, default: 1, min: 1},
      children: { type: Number, default: 0, min: 0},
    },
    message: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true
    },
    home: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
      required: true,
    },
  },
  { timestamps: true }
);

// Optional: Prevent double bookings (Simple constraint)
// bookingSchema.index({ home: 1, checkInDate: 1, checkOutDate: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
