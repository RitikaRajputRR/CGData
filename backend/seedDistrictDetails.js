const mongoose = require("mongoose");
require("dotenv").config();

const District = require("./models/District");

const REVENUE_SOURCE =
  "https://revenue.cg.nic.in/CencusCodeDetails.aspx?Flag=T";

const VERIFIED_DATE = "2026-09-21";

/*
===========================================================
OFFICIAL CHHATTISGARH REVENUE TEHSIL CENSUS DATA
===========================================================

Source:
Chhattisgarh Revenue & Disaster Management Department

Source URL:
https://revenue.cg.nic.in/CencusCodeDetails.aspx?Flag=T

Official records:
252 Tehsil entries

Each record:
- District
- District Census Code
- Tehsil
- Tehsil Census Code
===========================================================
*/

const districtTehsils = [
  {
    districtName: "Kabirdham",
    districtCensusCode: "382",
    tehsils: [
      ["पिपरिया", "7324"],
      ["कुंडा", "7323"],
      ["कुकदूर", "7351"],
      ["बोडला", "3299"],
      ["कवर्धा", "3298"],
      ["पंडरिया", "3301"],
      ["सहसपुर लोहारा", "3300"],
      ["रेंगाखारकला", "7272"],
    ],
  },

  {
    districtName: "Kanker",
    districtCensusCode: "381",
    tehsils: [
      ["कांकेर", "3351"],
      ["नरहरपुर", "3352"],
      ["चारमा", "3348"],
      ["भानुप्रतापपुर", "3349"],
      ["अन्तागढ़", "3353"],
      ["पखांजुर", "3354"],
      ["दुर्गुकोंडल", "3350"],
      ["सरोना", "7325"],
      ["कोयलीबेडा", "7345"],
      ["बांदे", "7353"],
      ["आमाबेडा", "7346"],
    ],
  },

  {
    districtName: "Kondagaon",
    districtCensusCode: "643",
    tehsils: [
      ["कोंडागांव", "3357"],
      ["केशकाल", "3355"],
      ["मकड़ी", "3358"],
      ["फरसगांव", "3359"],
      ["बड़ेराजपुर", "3356"],
      ["मर्दापाल", "7319"],
      ["धनोरा", "7320"],
    ],
  },

  {
    districtName: "Korba",
    districtCensusCode: "383",
    tehsils: [
      ["करतला", "3276"],
      ["कटघोरा", "3272"],
      ["कोरबा", "3275"],
      ["पाली", "3274"],
      ["पौड़ी उपरौदा", "3273"],
      ["अजगरबहार", "7241"],
      ["बरपाली", "7233"],
      ["पसान", "7237"],
      ["हरदीबाजार", "7271"],
      ["दर्री", "7266"],
      ["दीपका", "7293"],
      ["भैसमा", "7328"],
    ],
  },

  {
    districtName: "Korea",
    districtCensusCode: "384",
    tehsils: [
      ["पटना", "7309"],
      ["पोड़ी-बचरा", "7270"],
      ["बैकुंठपुर", "3232"],
      ["सोनहत", "3233"],
    ],
  },

  {
    districtName: "Khairagarh-Chhuikhadan-Gandai",
    districtCensusCode: "759",
    tehsils: [
      ["साल्हेवारा", "7294"],
      ["गंडई", "7264"],
      ["छुईखदान", "3302"],
      ["खैरागढ़", "3303"],
    ],
  },

  {
    districtName: "Gariaband",
    districtCensusCode: "645",
    tehsils: [
      ["गरियाबंद", "3335"],
      ["राजिम", "3333"],
      ["देवभोग", "3338"],
      ["छुरा", "3336"],
      ["मैनपुर", "3337"],
      ["अमलीपदर", "7307"],
      ["फिंगेश्वर", "7343"],
    ],
  },

  {
    districtName: "Gaurela-Pendra-Marwahi",
    districtCensusCode: "734",
    tehsils: [
      ["सकोला", "7252"],
      ["मरवाही", "3288"],
      ["पेण्ड्रा", "3289"],
      ["पेण्ड्रारोड", "3287"],
    ],
  },

  {
    districtName: "Jashpur",
    districtCensusCode: "380",
    tehsils: [
      ["पत्थलगांव", "3262"],
      ["बगीचा", "3255"],
      ["कुनकुरी", "3259"],
      ["जशपुर", "3257"],
      ["कांसाबेल", "3256"],
      ["मनोरा", "3258"],
      ["दुलदुला", "3260"],
      ["फरसाबहार", "3261"],
      ["सन्ना", "7234"],
      ["बागबहार", "7347"],
      ["तपकरा", "7603"],
    ],
  },

  {
    districtName: "Janjgir-Champa",
    districtCensusCode: "379",
    tehsils: [
      ["सारागाँव", "7274"],
      ["चांपा", "3281"],
      ["जांजगीर", "3277"],
      ["पामगढ़", "3283"],
      ["बलोदा", "3279"],
      ["अकलतरा", "3278"],
      ["नवागढ़", "3280"],
      ["शिवरीनारायण", "7256"],
      ["बम्हनीडिह", "7265"],
    ],
  },

  {
    districtName: "Dantewada",
    districtCensusCode: "376",
    tehsils: [
      ["बारसूर", "7232"],
      ["दंतेवाडा", "3369"],
      ["गीदम", "3370"],
      ["कुवाकोंडा", "3372"],
      ["कटेकल्याण", "3371"],
      ["बड़ेबचेली", "3618"],
    ],
  },

  {
    districtName: "Durg",
    districtCensusCode: "378",
    tehsils: [
      ["पाटन", "3318"],
      ["धमधा", "3316"],
      ["दुर्ग", "3317"],
      ["भिलाई-3", "7329"],
      ["बोरी", "7330"],
      ["अहिवारा", "7331"],
    ],
  },

  {
    districtName: "Dhamtari",
    districtCensusCode: "377",
    tehsils: [
      ["कुकरेल", "7314"],
      ["बेलरगांव", "7316"],
      ["भखारा", "7315"],
      ["कुरुद", "3344"],
      ["धमतरी", "3346"],
      ["मगरलोड", "3345"],
      ["नगरी", "3347"],
    ],
  },

  {
    districtName: "Narayanpur",
    districtCensusCode: "637",
    tehsils: [
      ["ओरछा", "3601"],
      ["नारायणपुर", "3600"],
      ["छोटेडोंगर", "7318"],
      ["कोहकामेटा", "7321"],
    ],
  },

  {
    districtName: "Bemetara",
    districtCensusCode: "650",
    tehsils: [
      ["दाढ़ी", "7357"],
      ["देवकर", "7298"],
      ["भिंभौरी", "7299"],
      ["नांदघाट", "7248"],
      ["बेमेतरा", "3312"],
      ["नवागढ़", "3311"],
      ["बेरला", "3315"],
      ["साजा", "3313"],
      ["थान खमरिया", "3314"],
    ],
  },

  {
    districtName: "Balrampur-Ramanujganj",
    districtCensusCode: "649",
    tehsils: [
      ["बलरामपुर", "3237"],
      ["वाड्रफ नगर", "3238"],
      ["राजपुर", "3250"],
      ["रामानुजगंज", "3236"],
      ["शंकरगढ़", "3241"],
      ["सामरी", "3240"],
      ["चांदो-सामरी", "7242"],
      ["रामचन्द्रपुर", "7238"],
      ["डौरा कोचली", "7251"],
      ["रघुनाथनगर", "7257"],
      ["चांदो", "7254"],
      ["चलगली", "7340"],
    ],
  },

  {
    districtName: "Baloda Bazar-Bhatapara",
    districtCensusCode: "644",
    tehsils: [
      ["लवन", "7246"],
      ["बलौदाबाजार", "3326"],
      ["भाटापारा", "3325"],
      ["कसड़ोल", "3328"],
      ["पलारी", "3327"],
      ["सिमगा", "3324"],
      ["सुहेला", "7249"],
      ["सोनाखान", "7296"],
      ["टुण्डरा", "7295"],
    ],
  },

  {
    districtName: "Bastar",
    districtCensusCode: "374",
    tehsils: [
      ["भानपुरी", "7312"],
      ["नानगुर", "7313"],
      ["करपावण्ड", "7344"],
      ["बस्तर", "3363"],
      ["बकावंड", "3364"],
      ["जगदलपुर", "3360"],
      ["लोहांडीगुड़ा", "3361"],
      ["बास्तानार", "3362"],
      ["तोकापल", "3365"],
      ["दरभा", "3366"],
    ],
  },

  {
    districtName: "Balod",
    districtCensusCode: "646",
    tehsils: [
      ["मार्री बंगला-देवरी", "7297"],
      ["अर्जुन्दा", "7253"],
      ["गुंडरदेही", "3319"],
      ["बालोद", "3321"],
      ["गुरूर", "3323"],
      ["डोंडी", "3322"],
      ["डोंडिलोहारा", "3320"],
    ],
  },

  {
    districtName: "Bilaspur",
    districtCensusCode: "375",
    tehsils: [
      ["पचपेड़ी", "7349"],
      ["बेलतरा", "7281"],
      ["बेलगहना", "7243"],
      ["सकरी", "7235"],
      ["बोदरी", "7250"],
      ["सीपत", "7247"],
      ["मस्तूरी", "3296"],
      ["तखतपुर", "3294"],
      ["बिलासपुर", "3295"],
      ["बिल्हा", "3297"],
      ["कोटा", "3291"],
      ["रतनपुर", "7239"],
    ],
  },

  {
    districtName: "Bijapur",
    districtCensusCode: "636",
    tehsils: [
      ["कुटरू", "7260"],
      ["गंगालूर", "7263"],
      ["भैरमगढ़", "3379"],
      ["भोपालपटनम", "3376"],
      ["बीजापुर", "3378"],
      ["उसूर", "3377"],
    ],
  },

  {
    districtName: "Mungeli",
    districtCensusCode: "647",
    tehsils: [
      ["लोरमी", "3290"],
      ["मुंगेली", "3292"],
      ["पथरिया", "3293"],
      ["लालपुर थाना", "7258"],
      ["सरगांव", "7326"],
      ["जरहागांव", "7311"],
    ],
  },

  {
    districtName: "Manendragarh-Chirmiri-Bharatpur",
    districtCensusCode: "760",
    tehsils: [
      ["कोटाडोल", "7275"],
      ["चिरमिरी", "7268"],
      ["केल्हारी", "7269"],
      ["भरतपुर", "3231"],
      ["खड़गवां", "3235"],
      ["मनेन्द्रगढ़", "3234"],
    ],
  },

  {
    districtName: "Mahasamund",
    districtCensusCode: "385",
    tehsils: [
      ["महासमुंद", "3341"],
      ["सराइपालि", "3340"],
      ["बसना", "3339"],
      ["बागबहारा", "3343"],
      ["पिथोरा", "3342"],
      ["कोमाखान", "7322"],
    ],
  },

  {
    districtName: "Mohla-Manpur-Ambagarh Chowki",
    districtCensusCode: "761",
    tehsils: [
      ["चौकी", "3310"],
      ["मोहाला", "3308"],
      ["मानपुर", "3309"],
      ["औंधी", "7278"],
      ["खडगाँव", "7277"],
    ],
  },

  {
    districtName: "Rajnandgaon",
    districtCensusCode: "388",
    tehsils: [
      ["डोंगरगढ़", "3304"],
      ["राजनांदगांव", "3305"],
      ["डोंगरगांव", "3307"],
      ["छुरिया", "3306"],
      ["लालबहादुर नगर", "7301"],
      ["घुमका", "7352"],
      ["कुमरदा", "7350"],
    ],
  },

  {
    districtName: "Raigarh",
    districtCensusCode: "386",
    tehsils: [
      ["तमनार", "3266"],
      ["धरम्जैगढ़", "3263"],
      ["घरघोड़ा", "3265"],
      ["खरसिया", "3269"],
      ["लैलुंगा", "3264"],
      ["पुस्सोर", "3268"],
      ["रायगढ़", "3267"],
      ["छाल", "7240"],
      ["मुकडेगा", "7300"],
      ["कापू", "7348"],
    ],
  },

  {
    districtName: "Raipur",
    districtCensusCode: "387",
    tehsils: [
      ["खरोरा", "7262"],
      ["गोबरा नवापारा", "7259"],
      ["आरंग", "3330"],
      ["रायपुर", "3332"],
      ["तिल्दा", "3334"],
      ["अभनपुर", "3331"],
      ["धरसीवा", "7292"],
      ["मंदिर हसौद", "7308"],
    ],
  },

  {
    districtName: "Sakti",
    districtCensusCode: "762",
    tehsils: [
      ["अड़भार", "7255"],
      ["हसौद", "7327"],
      ["चंद्रपुर", "7354"],
      ["भोथिया", "7400"],
      ["जैजैपुर", "3286"],
      ["नया बाराद्वार", "7267"],
      ["सक्ती", "3282"],
      ["मालखरोदा", "3285"],
      ["डभरा", "3284"],
    ],
  },

  {
    districtName: "Sukma",
    districtCensusCode: "642",
    tehsils: [
      ["तोंगापाल", "7317"],
      ["गादीरास", "9999"],
      ["दोरनापाल", "7355"],
      ["जगरगुण्डा", "7356"],
      ["छिंदगढ़", "3374"],
      ["कोंटा", "3373"],
      ["सुकमा", "3375"],
    ],
  },

  {
    districtName: "Surguja",
    districtCensusCode: "389",
    tehsils: [
      ["बतौली", "3253"],
      ["सीतापुर", "3252"],
      ["लुंडरा", "3251"],
      ["लखनपुर", "3248"],
      ["उदयपुर", "3249"],
      ["अम्बिकापुर", "3247"],
      ["मैनपाट", "3254"],
      ["दरिमा", "7261"],
    ],
  },

  {
    districtName: "Surajpur",
    districtCensusCode: "648",
    tehsils: [
      ["बिहारपुर", "7245"],
      ["लटोरी", "7236"],
      ["सूरजपुर", "3242"],
      ["प्रतापपुर", "3239"],
      ["भैयाथान", "3244"],
      ["ओडगी", "3243"],
      ["रामानुजनगर", "3245"],
      ["प्रेमनगर", "3246"],
      ["भटगांव", "3720"],
    ],
  },

  {
    districtName: "Sarangarh-Bilaigarh",
    districtCensusCode: "763",
    tehsils: [
      ["बरमकेला", "3271"],
      ["सारंगढ़", "3270"],
      ["बिलाईगढ़", "3329"],
      ["सरसींवा", "7401"],
      ["भटगांव", "7276"],
      ["सरिया", "7244"],
    ],
  },
];

/*
===========================================================
VALIDATION HELPERS
===========================================================
*/

function validateSeedData() {
  // 1. District count
  if (districtTehsils.length !== 33) {
    throw new Error(
      `Expected 33 districts, found ${districtTehsils.length}`
    );
  }

  // 2. Total tehsil count
  const totalTehsilEntries = districtTehsils.reduce(
    (total, district) => total + district.tehsils.length,
    0
  );

  if (totalTehsilEntries !== 252) {
    throw new Error(
      `Expected 252 Tehsil entries, found ${totalTehsilEntries}`
    );
  }

  // 3. Duplicate district names
  const districtNames = districtTehsils.map(
    (district) => district.districtName
  );

  const duplicateDistrictNames = districtNames.filter(
    (name, index) => districtNames.indexOf(name) !== index
  );

  if (duplicateDistrictNames.length > 0) {
    throw new Error(
      `Duplicate district names found: ${[
        ...new Set(duplicateDistrictNames),
      ].join(", ")}`
    );
  }

  // 4. Duplicate district census codes
  const districtCensusCodes = districtTehsils.map(
    (district) => district.districtCensusCode
  );

  const duplicateDistrictCodes = districtCensusCodes.filter(
    (code, index) =>
      districtCensusCodes.indexOf(code) !== index
  );

  if (duplicateDistrictCodes.length > 0) {
    throw new Error(
      `Duplicate district census codes found: ${[
        ...new Set(duplicateDistrictCodes),
      ].join(", ")}`
    );
  }

  // 5. Detect placeholder/invalid codes
  const invalidCodes = [];

  for (const district of districtTehsils) {
    for (const [name, censusCode] of district.tehsils) {
      if (
        !censusCode ||
        censusCode === "9999" ||
        !/^\d+$/.test(censusCode)
      ) {
        invalidCodes.push({
          district: district.districtName,
          tehsil: name,
          censusCode,
        });
      }
    }
  }

  if (invalidCodes.length > 0) {
    console.error("\nInvalid Census Codes detected:");

    invalidCodes.forEach((item) => {
      console.error(
        `  ${item.district} → ${item.tehsil} → ${item.censusCode}`
      );
    });

    throw new Error(
      "Invalid or placeholder Tehsil Census Code found. Verify it from the official Revenue source before seeding."
    );
  }

  // 6. Duplicate tehsil census codes
  const allTehsilCodes = districtTehsils.flatMap(
    (district) =>
      district.tehsils.map(([, censusCode]) => censusCode)
  );

  const duplicateTehsilCodes = allTehsilCodes.filter(
    (code, index) =>
      allTehsilCodes.indexOf(code) !== index
  );

  if (duplicateTehsilCodes.length > 0) {
    throw new Error(
      `Duplicate Tehsil Census Codes found: ${[
        ...new Set(duplicateTehsilCodes),
      ].join(", ")}`
    );
  }

  // 7. Empty tehsil names
  for (const district of districtTehsils) {
    for (const [name, censusCode] of district.tehsils) {
      if (!name || !name.trim()) {
        throw new Error(
          `Empty Tehsil name found in ${district.districtName}`
        );
      }

      if (!censusCode || !censusCode.trim()) {
        throw new Error(
          `Missing Census Code for ${district.districtName} → ${name}`
        );
      }
    }
  }

  return totalTehsilEntries;
}

/*
===========================================================
RUN VALIDATION BEFORE DATABASE CONNECTION
===========================================================
*/

let totalTehsilEntries;

try {
  totalTehsilEntries = validateSeedData();

  console.log("====================================");
  console.log("TEHSIL DATA VALIDATION PASSED");
  console.log("====================================");
  console.log("Districts:", districtTehsils.length);
  console.log("Tehsil entries:", totalTehsilEntries);
  console.log("====================================\n");
} catch (error) {
  console.error("TEHSIL DATA VALIDATION FAILED:");
  console.error(error.message);
  process.exit(1);
}

/*
===========================================================
SEED DATABASE
===========================================================
*/

async function seedDistrictDetails() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing in .env file"
      );
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Atlas connected");
    console.log(
      "Updating official Revenue Census Tehsil data...\n"
    );

    let updated = 0;
    let notFound = 0;

    for (const districtData of districtTehsils) {
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
      Keep existing tehsil string array for frontend
      compatibility.
      -------------------------------------------------------
      */

      district.tehsils = districtData.tehsils.map(
        ([name]) => name
      );

      /*
      -------------------------------------------------------
      Store official Census codes separately.
      -------------------------------------------------------
      */

      district.tehsilDetails = districtData.tehsils.map(
        ([name, censusCode]) => ({
          name,
          censusCode,
        })
      );

      /*
      -------------------------------------------------------
      District Census Code
      -------------------------------------------------------
      */

      district.districtCensusCode =
        districtData.districtCensusCode;

      /*
      -------------------------------------------------------
      Source
      -------------------------------------------------------
      Do not overwrite an existing source URL.
      -------------------------------------------------------
      */

      if (!district.sourceUrl) {
        district.sourceUrl = REVENUE_SOURCE;
      }

      /*
      -------------------------------------------------------
      Verification Date
      -------------------------------------------------------
      */

      district.lastVerifiedDate = VERIFIED_DATE;

      /*
      -------------------------------------------------------
      Save
      -------------------------------------------------------
      */

      await district.save();

      console.log(
        `UPDATED: ${districtData.districtName}`
      );

      console.log(
        `  District Code: ${districtData.districtCensusCode}`
      );

      console.log(
        `  Tehsils: ${districtData.tehsils.length}`
      );

      updated++;
    }

    console.log("\n====================================");
    console.log("OFFICIAL TEHSIL SEED COMPLETE");
    console.log("====================================");
    console.log(
      "Districts in seed:",
      districtTehsils.length
    );
    console.log(
      "Total Tehsil entries:",
      totalTehsilEntries
    );
    console.log("Updated:", updated);
    console.log("Not found:", notFound);
    console.log("Source:", REVENUE_SOURCE);
    console.log("Verified:", VERIFIED_DATE);
    console.log("====================================");

    /*
    -------------------------------------------------------
    Final result validation
    -------------------------------------------------------
    */

    if (notFound > 0) {
      console.warn(
        `WARNING: ${notFound} districts were not found in MongoDB.`
      );
    }

    await mongoose.connection.close();

    console.log("MongoDB connection closed");
  } catch (error) {
    console.error(
      "\nTehsil seed error:",
      error.message
    );

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

seedDistrictDetails();