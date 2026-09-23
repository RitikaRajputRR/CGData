const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema(
  {
    // =========================
    // BASIC DISTRICT INFORMATION
    // =========================

    districtName: {
      type: String,
      required: true,
      trim: true,
    },

    headquarters: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    area: {
      type: String,
      trim: true,
    },

    population: {
      type: String,
      trim: true,
    },

    // =========================
    // AGRICULTURE
    // =========================

    agricultureMajorCrops: {
      type: String,
      trim: true,
    },

    odopProducts: {
      type: [String],
      default: [],
    },

    // =========================
    // EDUCATION
    // =========================

    schools: {
      type: String,
      trim: true,
    },

    privateSchools: {
      type: String,
      trim: true,
    },

    collegesUniversities: {
      type: String,
      trim: true,
    },

    privateColleges: {
      type: String,
      trim: true,
    },

    // =========================
    // HEALTH
    // =========================

    governmentHospitals: {
      type: String,
      trim: true,
    },

    privateHospitals: {
      type: String,
      trim: true,
    },

    governmentMedicalCollege: {
      type: String,
      trim: true,
    },

    privateMedicalColleges: {
      type: String,
      trim: true,
    },

    clinics: {
      type: String,
      trim: true,
    },

    diagnosticCentres: {
      type: String,
      trim: true,
    },

    bloodBanks: {
      type: String,
      trim: true,
    },

    // =========================
    // EMERGENCY / PUBLIC SERVICES
    // =========================

    emergencyHelplines: {
      type: String,
      trim: true,
    },

    animalVeterinaryHelp: {
      type: String,
      trim: true,
    },

    electricityContact: {
      type: String,
      trim: true,
    },

    waterSupplyContact: {
      type: String,
      trim: true,
    },

    // =========================
    // GOVERNMENT INFORMATION
    // =========================

    governmentSchemes: {
      type: String,
      trim: true,
    },

    collectorContact: {
      type: String,
      trim: true,
    },

    collectorName: {
      type: String,
      trim: true,
    },

    spContact: {
      type: String,
      trim: true,
    },

    spName: {
      type: String,
      trim: true,
    },

    // =========================
    // ADMINISTRATION
    // =========================

    blocks: {
      type: String,
      trim: true,
    },

    subdivisions: {
      type: [String],
      default: [],
    },

    tehsils: {
      type: [String],
      default: [],
    },

    subTehsils: {
      type: [String],
      default: [],
    },

    gramPanchayats: {
      type: String,
      trim: true,
    },

    villages: {
      type: String,
      trim: true,
    },

    municipalities: {
      type: String,
      trim: true,
    },

    districtCensusCode: {
      type: String,
      trim: true,
    },

    tehsilDetails: {
      type: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
          },

          censusCode: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],

      default: [],
    },

    // =========================
    // TRANSPORT
    // =========================

    busStand: {
      type: String,
      trim: true,
    },

    railwayStations: {
      type: String,
      trim: true,
    },

    nearestAirport: {
      type: String,
      trim: true,
    },

    // =========================
    // POLICE
    // =========================

    policeStations: {
      type: String,
      trim: true,
    },

    // =========================
    // ECONOMY / INDUSTRY
    // =========================

    majorIndustries: {
      type: String,
      trim: true,
    },

    majorCitiesTowns: {
      type: String,
      trim: true,
    },

    // =========================
    // CULTURE / FOOD
    // =========================

    famousFood: {
      type: String,
      trim: true,
    },

    festivalsCulture: {
      type: String,
      trim: true,
    },

    handicrafts: {
      type: String,
      trim: true,
    },

    languages: {
      type: String,
      trim: true,
    },

    // =========================
    // TOURISM INFORMATION
    // =========================

    naturalPlaces: {
      type: String,
      trim: true,
    },

    religiousPlaces: {
      type: String,
      trim: true,
    },

    touristPlaces: {
      type: String,
      trim: true,
    },

    wildlifeNationalParks: {
      type: String,
      trim: true,
    },

    // =========================
    // TOURISM PHOTO GALLERY
    // =========================
    /*
      Example:

      tourismGallery: [
        {
          name: "Amritdhara Waterfall",
          category: "Waterfall",
          imageUrl: "/images/tourism/mcb/amritdhara.jpg",
          sourceUrl: "https://official-source-url.com"
        }
      ]

      Important:
      imageUrl should point to a real image.
      sourceUrl should identify the source of the image/place information.
    */

    tourismGallery: {
      type: [
        {
          name: {
            type: String,
            trim: true,
          },

          category: {
            type: String,
            trim: true,
          },

          imageUrl: {
            type: String,
            trim: true,
          },

          sourceUrl: {
            type: String,
            trim: true,
          },
        },
      ],

      default: [],
    },

    // =========================
    // OFFICIAL INFORMATION
    // =========================

    officialWebsite: {
      type: String,
      trim: true,
    },

    lastVerifiedDate: {
      type: String,
      trim: true,
    },

    // =========================
    // SOURCES
    // =========================

    sourceUrl: {
      type: String,
      trim: true,
    },

    // =========================
    // DISTRICT IMAGES
    // =========================

    imageUrl: {
      type: String,
      trim: true,
    },

    imageGallery: {
      type: [String],
      default: [],
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "District",
  districtSchema
);