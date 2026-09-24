const express = require("express");
const router = express.Router();

const Tourism = require("../models/Tourism");

// GET all tourism data
router.get("/", async (req, res) => {
  try {
    const { district, category } = req.query;

    const filter = {};

    if (district) {
      filter.district = district;
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const tourism = await Tourism.find(filter).sort({
      district: 1,
      category: 1,
      name: 1,
    });

    res.json({
      success: true,
      count: tourism.length,
      data: tourism,
    });
  } catch (error) {
    console.error("Tourism API error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load tourism data",
      error: error.message,
    });
  }
});

// GET tourism by district
router.get("/district/:district", async (req, res) => {
  try {
    const tourism = await Tourism.find({
      district: req.params.district,
    }).sort({
      category: 1,
      name: 1,
    });

    res.json({
      success: true,
      count: tourism.length,
      data: tourism,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load district tourism",
      error: error.message,
    });
  }
});

// GET tourism by category
router.get("/category/:category", async (req, res) => {
  try {
    const tourism = await Tourism.find({
      category: req.params.category,
    }).sort({
      district: 1,
      name: 1,
    });

    res.json({
      success: true,
      count: tourism.length,
      data: tourism,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load tourism category",
      error: error.message,
    });
  }
});

module.exports = router;