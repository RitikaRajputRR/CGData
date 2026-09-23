const express = require("express");
const District = require("../models/District");

const router = express.Router();

// Get all districts
router.get("/", async (req, res) => {
  try {
    const districts = await District.find().sort({ districtName: 1 });

    res.json(districts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch districts",
      error: error.message,
    });
  }
});

// Get one district by name
router.get("/:districtName", async (req, res) => {
  try {
    const district = await District.findOne({
      districtName: req.params.districtName,
    });

    if (!district) {
      return res.status(404).json({
        message: "District not found",
      });
    }

    res.json(district);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch district",
      error: error.message,
    });
  }
});

module.exports = router;
