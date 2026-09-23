const mongoose = require("mongoose");
require("dotenv").config();

const District = require("./models/District");

const REVENUE_TEHSIL_SOURCE =
  "https://revenue.cg.nic.in/CencusCodeDetails.aspx?Flag=T";

const ODOP_SOURCE =
  "https://invest.cg.gov.in/odop";

const VERIFIED_DATE = "2026-09-21";

/*
===========================================================
CG DATA - DISTRICT MASTER SEED
===========================================================

This seed updates only official ODOP information.

Sources:
1. ODOP
   Chhattisgarh Industries Department
   https://invest.cg.gov.in/odop

2. Revenue Census / Tehsil information
   Chhattisgarh Revenue & Disaster Management Department
   https://revenue.cg.nic.in/CencusCodeDetails.aspx?Flag=T

IMPORTANT:
- Do not invent district information.
- Existing verified values are preserved.
- This file updates ODOP only.
- Tehsil/Census information is handled by seedDistrictDetails.js.
- Administration/block information is handled by
  seedDistrictAdministration.js.
===========================================================
*/

const masterDistricts = [
  {
    districtName: "Balod",
    odopProducts: ["Handloom"],
  },

  {
    districtName: "Baloda Bazar-Bhatapara",
    odopProducts: ["Rice based products - Poha, etc."],
  },

  {
    districtName: "Balrampur-Ramanujganj",
    odopProducts: ["Rice - Jirafuli, Bisni"],
  },

  {
    districtName: "Bastar",
    odopProducts: ["Bell Metal", "Tamarind"],
  },

  {
    districtName: "Bemetara",
    odopProducts: ["Papaya based product"],
  },

  {
    districtName: "Bijapur",
    odopProducts: [
      "Minor forest produce - Tamarind",
      "Minor forest produce - Mahua",
    ],
  },

  {
    districtName: "Bilaspur",
    odopProducts: ["Black Rice"],
  },

  {
    districtName: "Dantewada",
    odopProducts: ["Minor forest produce - Tamarind"],
  },

  {
    districtName: "Dhamtari",
    odopProducts: ["Rice"],
  },

  {
    districtName: "Durg",
    odopProducts: ["Tomato Based Product"],
  },

  {
    districtName: "Gariaband",
    odopProducts: ["Minor forest produce - Chironji"],
  },

  {
    districtName: "Gaurela-Pendra-Marwahi",
    odopProducts: ["Groundnuts"],
  },

  {
    districtName: "Janjgir-Champa",
    odopProducts: ["Kosa"],
  },

  {
    districtName: "Jashpur",
    odopProducts: ["Litchi"],
  },

  {
    districtName: "Kabirdham",
    odopProducts: [
      "Sugarcane based products - Jaggery",
      "Sugarcane based products - Molasses",
    ],
  },

  {
    districtName: "Kanker",
    odopProducts: ["Custard Apple based products"],
  },

  {
    districtName: "Khairagarh-Chhuikhadan-Gandai",
    odopProducts: ["Soyabean"],
  },

  {
    districtName: "Kondagaon",
    odopProducts: ["Bell Metal", "Bastar Craft"],
  },

  {
    districtName: "Korba",
    odopProducts: ["Minor forest produce - Mahua"],
  },

  {
    districtName: "Korea",
    odopProducts: ["Tomato"],
  },

  {
    districtName: "Mahasamund",
    odopProducts: ["Milk based products"],
  },

  {
    districtName: "Manendragarh-Chirmiri-Bharatpur",
    odopProducts: ["Tomato"],
  },

  {
    districtName: "Mohla-Manpur-Ambagarh Chowki",
    odopProducts: ["Soyabean"],
  },

  {
    districtName: "Mungeli",
    odopProducts: ["Groundnuts"],
  },

  {
    districtName: "Narayanpur",
    odopProducts: ["Black Gram"],
  },

  {
    districtName: "Raigarh",
    odopProducts: ["Tomato"],
  },

  {
    districtName: "Raipur",
    odopProducts: ["Papaya based product"],
  },

  {
    districtName: "Rajnandgaon",
    odopProducts: ["Soyabean"],
  },

  {
    districtName: "Sakti",
    odopProducts: ["Kosa"],
  },

  {
    districtName: "Sarangarh-Bilaigarh",
    odopProducts: ["Tomato"],
  },

  {
    districtName: "Sukma",
    odopProducts: [
      "Wooden Craft",
      "Millet based product",
    ],
  },

  {
    districtName: "Surajpur",
    odopProducts: ["Turmeric", "Potato"],
  },

  {
    districtName: "Surguja",
    odopProducts: ["Jackfruit", "Potato"],
  },
];

/*
===========================================================
VALIDATION
===========================================================
*/

function validateMasterData() {
  /*
    Check exactly 33 districts.
  */
  if (masterDistricts.length !== 33) {
    throw new Error(
      `Expected 33 districts but found ${masterDistricts.length}`
    );
  }

  /*
    Check duplicate district names.
  */
  const districtNames = masterDistricts.map(
    (district) => district.districtName
  );

  const duplicateDistrictNames = districtNames.filter(
    (name, index) =>
      districtNames.indexOf(name) !== index
  );

  if (duplicateDistrictNames.length > 0) {
    throw new Error(
      `Duplicate district names found: ${[
        ...new Set(duplicateDistrictNames),
      ].join(", ")}`
    );
  }

  /*
    Check ODOP data.
  */
  for (const district of masterDistricts) {
    if (
      !district.odopProducts ||
      !Array.isArray(district.odopProducts) ||
      district.odopProducts.length === 0
    ) {
      throw new Error(
        `ODOP data missing for: ${district.districtName}`
      );
    }

    for (const product of district.odopProducts) {
      if (!product || !product.trim()) {
        throw new Error(
          `Invalid ODOP product for: ${district.districtName}`
        );
      }
    }
  }
}

/*
===========================================================
RUN VALIDATION
===========================================================
*/

try {
  validateMasterData();

  console.log("====================================");
  console.log("MASTER DATA VALIDATION PASSED");
  console.log("====================================");
  console.log("Districts:", masterDistricts.length);
  console.log("ODOP source:", ODOP_SOURCE);
  console.log("====================================\n");
} catch (error) {
  console.error("MASTER DATA VALIDATION FAILED:");
  console.error(error.message);
  process.exit(1);
}

/*
===========================================================
DATABASE SEED
===========================================================
*/

async function seedDistrictMaster() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing in .env file"
      );
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Atlas connected");
    console.log("Starting 33 district ODOP master seed...\n");

    let updated = 0;
    let notFound = 0;

    for (const districtData of masterDistricts) {
      const district = await District.findOne({
        districtName: districtData.districtName,
      });

      if (!district) {
        console.log(
          `NOT FOUND: ${districtData.districtName}`
        );

        notFound++;
        continue;
      }

      /*
      -------------------------------------------------------
      Update ONLY ODOP.
      -------------------------------------------------------
      */

      district.odopProducts = districtData.odopProducts;

      /*
      -------------------------------------------------------
      Preserve existing source URL.
      If source is empty, use ODOP official source.
      -------------------------------------------------------
      */

      if (!district.sourceUrl) {
        district.sourceUrl = ODOP_SOURCE;
      }

      /*
      -------------------------------------------------------
      Preserve existing verification date.
      -------------------------------------------------------
      */

      if (!district.lastVerifiedDate) {
        district.lastVerifiedDate = VERIFIED_DATE;
      }

      await district.save();

      console.log(
        `UPDATED: ${districtData.districtName}`
      );

      console.log(
        `  ODOP: ${districtData.odopProducts.join(", ")}`
      );

      updated++;
    }

    /*
    =======================================================
    FINAL RESULT
    =======================================================
    */

    console.log("\n====================================");
    console.log("MASTER SEED COMPLETE");
    console.log("====================================");

    console.log(
      "Total master districts:",
      masterDistricts.length
    );

    console.log("Updated:", updated);
    console.log("Not found:", notFound);

    console.log(
      "ODOP source:",
      ODOP_SOURCE
    );

    console.log(
      "Revenue Census source:",
      REVENUE_TEHSIL_SOURCE
    );

    console.log(
      "Verified date:",
      VERIFIED_DATE
    );

    console.log("====================================");

    await mongoose.connection.close();

    console.log("MongoDB connection closed");
  } catch (error) {
    console.error(
      "\nMaster seed error:",
      error.message
    );

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

seedDistrictMaster();