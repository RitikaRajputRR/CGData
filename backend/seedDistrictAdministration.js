const mongoose = require("mongoose");
require("dotenv").config();

const District = require("./models/District");

const SOURCE_URL =
  "https://invest.cg.gov.in/policy-documents/402/view";

const VERIFIED_DATE = "2026-09-21";

const districtAdministration = [
  {
    districtName: "Balod",
    blocks: "Balod, Gundardehi, Gurur, Dondi, Dondi-Lohara",
  },
  {
    districtName: "Baloda Bazar-Bhatapara",
    blocks: "Balodabazar, Bhatapara, Simga, Palari, Kasdol",
  },
  {
    districtName: "Balrampur-Ramanujganj",
    blocks:
      "Balrampur, Kusmi, Rajpur, Ramchandrapur, Shankargarh, Wadrafnagar",
  },
  {
    districtName: "Bastar",
    blocks:
      "Jagdalpur, Bakawand, Bastanar, Darbha, Lohandiguda, Bastar, Tokapal",
  },
  {
    districtName: "Bemetara",
    blocks: "Bemetara, Saja, Berla, Nawagarh",
  },
  {
    districtName: "Bijapur",
    blocks:
      "Bijapur, Bhairamgarh, Bhopalpattnam, Usur",
  },
  {
    districtName: "Bilaspur",
    blocks: "Bilha, Takhatpur, Masturi, Kota",
  },
  {
    districtName: "Dantewada",
    blocks:
      "Dantewada, Geedam, Katekalyan, Kuakonda",
  },
  {
    districtName: "Dhamtari",
    blocks:
      "Dhamtari, Kurud, Magarlod, Nagari",
  },
  {
    districtName: "Durg",
    blocks:
      "Durg, Dhamdha, Patan",
  },
  {
    districtName: "Gariaband",
    blocks:
      "Gariyaband, Fingeshwar, Chhura, Deobhog, Mainpur",
  },
  {
    districtName: "Gaurela-Pendra-Marwahi",
    blocks:
      "Pendra Road, Pendra, Marwahi",
  },
  {
    districtName: "Janjgir-Champa",
    blocks:
      "Akaltara, Bamhanidih, Nawagarh, Baloda, Pamgarh",
  },
  {
    districtName: "Jashpur",
    blocks:
      "Jashpur, Pathalgaon, Kunkuri, Bagicha, Duldula, Manora, Kansabel, Farsabahar",
  },
  {
    districtName: "Kabirdham",
    blocks:
      "Kawardha, Bodla, Sahaspur Lohara, Pandariya",
  },
  {
    districtName: "Kanker",
    blocks:
      "Kanker, Charama, Antagarh, Bhanupratappur, Durgukondal, Narharpur, Koyalibeda",
  },
  {
    districtName: "Khairagarh-Chhuikhadan-Gandai",
    blocks:
      "Khairagarh, Chhuikhadan",
  },
  {
    districtName: "Kondagaon",
    blocks:
      "Kondagaon, Keshkal, Baderajpur, Makdi, Farasgaon",
  },
  {
    districtName: "Korba",
    blocks:
      "Korba, Katghora, Pali, Kartala, Podhi-Uprora",
  },
  {
    districtName: "Korea",
    blocks:
      "Baikunthpur, Sonhat",
  },
  {
    districtName: "Mahasamund",
    blocks:
      "Mahasamund, Saraipali, Pithora, Bagbahara, Basna",
  },
  {
    districtName: "Manendragarh-Chirmiri-Bharatpur",
    blocks:
      "Manendragarh, Bharatpur, Khadgawan",
  },
  {
    districtName: "Mohla-Manpur-Ambagarh Chowki",
    blocks:
      "Ambagarh Chowki, Manpur, Mohla",
  },
  {
    districtName: "Mungeli",
    blocks:
      "Mungeli, Patharia, Lormi",
  },
  {
    districtName: "Narayanpur",
    blocks:
      "Narayanpur, Orchha",
  },
  {
    districtName: "Raigarh",
    blocks:
      "Raigarh, Kharsia, Tamnar, Gharghoda, Pusaur, Dharamjaygarh, Lailunga",
  },
  {
    districtName: "Raipur",
    blocks:
      "Dharsiva, Tilda, Arang, Abhanpur",
  },
  {
    districtName: "Rajnandgaon",
    blocks:
      "Rajnandgaon, Dongargarh, Dongargaon, Churiya",
  },
  {
    districtName: "Sakti",
    blocks:
      "Sakti, Jaijaipur, Malkharoda, Dabhra",
  },
  {
    districtName: "Sarangarh-Bilaigarh",
    blocks:
      "Sarangarh, Baramkela, Bilaigarh",
  },
  {
    districtName: "Sukma",
    blocks:
      "Konta, Chhindgarh, Sukma",
  },
  {
    districtName: "Surajpur",
    blocks:
      "Surajpur, Pratappur, Premnagar, Bhaiyathan, Odagi, Ramanujnagar",
  },
  {
    districtName: "Surguja",
    blocks:
      "Ambikapur, Lundra, Lakhanpur, Sitapur, Batoli, Udaipur, Mainpat",
  },
];

async function seedAdministration() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Atlas connected");
    console.log("Starting administration seed...\n");

    if (districtAdministration.length !== 33) {
      throw new Error(
        `Expected 33 districts but found ${districtAdministration.length}`
      );
    }

    let updated = 0;
    let notFound = 0;

    for (const data of districtAdministration) {
      const district = await District.findOne({
        districtName: data.districtName,
      });

      if (!district) {
        console.log(`NOT FOUND: ${data.districtName}`);
        notFound++;
        continue;
      }

      district.blocks = data.blocks;

      // Preserve existing source if already present.
      // Otherwise use the official policy source.
      if (!district.sourceUrl) {
        district.sourceUrl = SOURCE_URL;
      }

      if (!district.lastVerifiedDate) {
        district.lastVerifiedDate = VERIFIED_DATE;
      }

      await district.save();

      console.log(`UPDATED: ${data.districtName}`);
      console.log(`  Blocks: ${data.blocks}`);

      updated++;
    }

    console.log("\n====================================");
    console.log("ADMINISTRATION SEED COMPLETE");
    console.log("====================================");
    console.log("Total districts:", districtAdministration.length);
    console.log("Updated:", updated);
    console.log("Not found:", notFound);
    console.log("Source:", SOURCE_URL);
    console.log("====================================");

    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Administration seed error:", error.message);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

seedAdministration();
