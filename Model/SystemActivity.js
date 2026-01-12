const mongoose = require("mongoose");

const systemActivitySchema = new mongoose.Schema(
  {
    actorType: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      required: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    action: {
      type: String,
      required: true, // CREATE_HOME, DELETE_BOOKING, LOGIN, etc.
    },

    entityType: {
      type: String,
      enum: ["Users", "Home", "Booking"],
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("SystemActivity", systemActivitySchema);
