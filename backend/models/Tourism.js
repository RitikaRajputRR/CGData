const mongoose = require("mongoose");

const tourismSchema = new mongoose.Schema(
  {
    district: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Waterfall",
        "Temple",
        "Forest",
        "Wildlife",
        "Culture",
        "Tourist Place",
        "Natural Place",
        "Festival",
      ],
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },

    sourceUrl: {
      type: String,
      default: "",
      trim: true,
    },

    verifiedDate: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tourism", tourismSchema);