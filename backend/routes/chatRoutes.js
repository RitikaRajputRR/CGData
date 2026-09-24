const express = require("express");
const District = require("../models/District");
const { generateAIResponse } = require("../services/aiService");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question, language = "Hinglish" } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const allDistricts = await District.find({}).lean();

    if (!allDistricts.length) {
      return res.status(404).json({
        success: false,
        message: "CG DATA is currently unavailable.",
      });
    }

    const normalizedQuestion = question.trim().toLowerCase();

    // District name aliases
    const districtAliases = {
      durg: ["durg", "दुर्ग"],
      raipur: ["raipur", "रायपुर"],
      bilaspur: ["bilaspur", "बिलासपुर"],
      korba: ["korba", "कोरबा"],
      bastar: ["bastar", "बस्तर"],
      "dantewada": ["dantewada", "दंतेवाड़ा", "दंतेवाडा"],
      "kanker": ["kanker", "कांकेर"],
      "rajnandgaon": ["rajnandgaon", "राजनांदगांव"],
      "balod": ["balod", "बालोद"],
      "bemetara": ["bemetara", "बेमेतरा"],
      "baloda bazar": ["baloda bazar", "बलौदा बाजार"],
      "gariaband": ["gariaband", "गरियाबंद"],
      "mahasamund": ["mahasamund", "महासमुंद"],
      "dhamtari": ["dhamtari", "धमतरी"],
      "surguja": ["surguja", "सरगुजा"],
      "korea": ["korea", "कोरिया"],
      "manendragarh-chirmiri-bharatpur": [
        "manendragarh",
        "chirmiri",
        "bharatpur",
        "mcb",
        "मनेंद्रगढ़",
      ],
      "gaurela-pendra-marwahi": [
        "gaurela",
        "pendra",
        "marwahi",
        "gpm",
        "गौरेला",
        "पेण्ड्रा",
        "मरवाही",
      ],
    };

    // Find mentioned district
    let matchedDistrict = null;

    for (const district of allDistricts) {
      const districtName = (district.districtName || "").toLowerCase();

      const aliases = districtAliases[districtName] || [districtName];

      const found = aliases.some((alias) =>
        normalizedQuestion.includes(alias.toLowerCase())
      );

      if (found) {
        matchedDistrict = district;
        break;
      }
    }

    // If district is found, send ONLY that district.
    // Otherwise send limited context.
    const districts = matchedDistrict
      ? [matchedDistrict]
      : allDistricts.slice(0, 5);

    const context = districts
      .map((district) => {
        return `
District: ${district.districtName || "N/A"}
Headquarters: ${district.headquarters || "N/A"}
Description: ${district.description || "N/A"}
Area: ${district.area || "N/A"}
Population: ${district.population || "N/A"}

Agriculture:
Major Crops: ${district.agricultureMajorCrops || "N/A"}

ODOP Products:
${
  Array.isArray(district.odopProducts)
    ? district.odopProducts.join(", ")
    : district.odopProducts || "N/A"
}

Administration:
Blocks:
${
  Array.isArray(district.blocks)
    ? district.blocks.join(", ")
    : district.blocks || "N/A"
}

Tehsils:
${
  Array.isArray(district.tehsilDetails)
    ? district.tehsilDetails.map((t) => t.name).join(", ")
    : "N/A"
}

Tourism:
Natural Places: ${district.naturalPlaces || "N/A"}
Religious Places: ${district.religiousPlaces || "N/A"}
Tourist Places: ${district.touristPlaces || "N/A"}
Wildlife / National Parks: ${
          district.wildlifeNationalParks || "N/A"
        }

Culture:
Famous Food: ${district.famousFood || "N/A"}
Festivals & Culture: ${district.festivalsCulture || "N/A"}
Handicrafts: ${district.handicrafts || "N/A"}
Languages: ${district.languages || "N/A"}

Education:
Schools: ${district.schools || "N/A"}
Colleges / Universities: ${
          district.collegesUniversities || "N/A"
        }

Health:
Government Hospitals: ${
          district.governmentHospitals || "N/A"
        }
Private Hospitals: ${district.privateHospitals || "N/A"}

Transport:
Bus Stand: ${district.busStand || "N/A"}
Railway Stations: ${
          district.railwayStations || "N/A"
        }
Nearest Airport: ${district.nearestAirport || "N/A"}

Industries:
Major Industries: ${district.majorIndustries || "N/A"}

Official Website:
${district.officialWebsite || "N/A"}

Source:
${district.sourceUrl || "N/A"}
        `;
      })
      .join("\n-----------------------------\n");

    console.log(
      `Chat question: ${question} | Context districts: ${districts.length}`
    );

    const answer = await generateAIResponse({
      question: question.trim(),
      language,
      context,
    });

    return res.json({
      success: true,
      answer,
      language,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process your question.",
      error: error.message,
    });
  }
});

module.exports = router;