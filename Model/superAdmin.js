const mongoose = require("mongoose");

const superAdminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: String,

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    permissions: {
      manageUsers: {
        type: Boolean,
        default: true,
      },
      manageAdmins: {
        type: Boolean,
        default: true,
      },
      manageHomes: {
        type: Boolean,
        default: true,
      },
      manageBookings: {
        type: Boolean,
        default: true,
      },
      viewActivities: {
        type: Boolean,
        default: true,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
