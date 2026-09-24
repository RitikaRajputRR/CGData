const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

const Tourism = require("./models/Tourism");

/* =========================================================
   MONGODB
========================================================= */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI missing in .env");
  process.exit(1);
}

/* =========================================================
   CONFIG
========================================================= */

const VERIFIED_DATE = new Date().toISOString().split("T")[0];

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/143 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
};

/* =========================================================
   33 DISTRICTS
========================================================= */

const DISTRICTS = [
  {
    district: "Balod",
    url: "https://balod.gov.in/en/tourist-places/",
  },
  {
    district: "Baloda Bazar",
    url: "https://balodabazar.gov.in/en/tourist-places/",
  },
  {
    district: "Balrampur-Ramanujganj",
    url: "https://balrampur.gov.in/en/tourist-places/",
  },
  {
    district: "Bastar",
    url: "https://bastar.gov.in/en/tourist-places/",
  },
  {
    district: "Bemetara",
    url: "https://bemetara.gov.in/en/tourist-places/",
  },
  {
    district: "Bijapur",
    url: "https://bijapur.gov.in/en/tourist-places/",
  },
  {
    district: "Bilaspur",
    url: "https://bilaspur.gov.in/en/tourist-places/",
  },
  {
    district: "Dantewada",
    url: "https://dantewada.gov.in/en/tourist-places/",
  },
  {
    district: "Dhamtari",
    url: "https://dhamtari.gov.in/en/tourist-places/",
  },
  {
    district: "Durg",
    url: "https://durg.gov.in/en/tourist-places/",
  },
  {
    district: "Gariaband",
    url: "https://gariaband.gov.in/en/tourist-places/",
  },
  {
    district: "Gaurela-Pendra-Marwahi",
    url: "https://gaurela-pendra-marwahi.cg.gov.in/tourist-places/",
  },
  {
    district: "Janjgir-Champa",
    url: "https://janjgir-champa.gov.in/en/tourist-places/",
  },
  {
    district: "Jashpur",
    url: "https://jashpur.gov.in/en/tourist-places/",
  },
  {
    district: "Kabirdham",
    url: "https://tourism.cgstate.gov.in/destinations/Kabirdham",
  },
  {
    district: "Kanker",
    url: "https://kanker.gov.in/en/tourist-places/",
  },
  {
    district: "Khairagarh-Chhuikhadan-Gandai",
    url: "https://khairagarh-chhuikhadan-gandai.cg.gov.in/en/tourist-places/",
  },
  {
    district: "Kondagaon",
    url: "https://kondagaon.gov.in/en/tourist-places/",
  },
  {
    district: "Korba",
    url: "https://korba.gov.in/en/tourist-places/",
  },
  {
    district: "Koriya",
    url: "https://korea.gov.in/en/tourist-places/",
  },
  {
    district: "Mahasamund",
    url: "https://mahasamund.gov.in/en/tourist-places/",
  },
  {
    district: "Manendragarh-Chirmiri-Bharatpur",
    url: "https://manendragarh-chirmiri-bharatpur.cg.gov.in/en/tourist-places/",
  },
  {
    district: "Mohla-Manpur-Ambagarh Chowki",
    url: "https://mohla-manpur-ambagarhchowki.cg.gov.in/en/tourist-places/",
  },
  {
    district: "Mungeli",
    url: "https://mungeli.gov.in/en/tourist-places/",
  },
  {
    district: "Narayanpur",
    url: "https://narayanpur.gov.in/en/tourist-places/",
  },
  {
    district: "Raigarh",
    url: "https://raigarh.gov.in/en/tourist-places/",
  },
  {
    district: "Raipur",
    url: "https://raipur.gov.in/en/tourist-places/",
  },
  {
    district: "Rajnandgaon",
    url: "https://rajnandgaon.gov.in/en/tourist-places/",
  },
  {
    district: "Sakti",
    url: "https://sakti.cg.gov.in/en/tourist-places/",
  },
  {
    district: "Sarangarh-Bilaigarh",
    url: "https://sarangarh-bilaigarh.cg.gov.in/en/tourist-places/",
  },
  {
    district: "Sukma",
    url: "https://sukma.gov.in/en/tourist-places/",
  },
  {
    district: "Surajpur",
    url: "https://surajpur.gov.in/en/tourist-places/",
  },
  {
    district: "Surguja",
    url: "https://surguja.gov.in/en/tourist-places/",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function absoluteUrl(url, baseUrl) {
  if (!url) return "";

  url = String(url).trim();

  if (!url) return "";

  if (url.startsWith("data:")) {
    return "";
  }

  try {
    return new URL(url, baseUrl).href;
  } catch {
    return "";
  }
}

/* =========================================================
   CLEAN TEXT
========================================================= */

function cleanText(text) {
  if (!text) return "";

  return String(text)
    .replace(/\s+/g, " ")
    .replace(/\n+/g, " ")
    .trim();
}

/* =========================================================
   CATEGORY DETECTION
========================================================= */

function detectCategory(name, description) {
  const text = `${name} ${description}`.toLowerCase();

  if (
    text.includes("waterfall") ||
    text.includes("falls") ||
    text.includes("dhara") ||
    text.includes("jharna")
  ) {
    return "Waterfall";
  }

  if (
    text.includes("temple") ||
    text.includes("mandir") ||
    text.includes("devi") ||
    text.includes("mahadev") ||
    text.includes("dham")
  ) {
    return "Temple";
  }

  if (
    text.includes("wildlife") ||
    text.includes("sanctuary") ||
    text.includes("tiger") ||
    text.includes("zoo") ||
    text.includes("safari")
  ) {
    return "Wildlife";
  }

  if (
    text.includes("forest") ||
    text.includes("jungle") ||
    text.includes("national park") ||
    text.includes("kanger")
  ) {
    return "Forest";
  }

  if (
    text.includes("culture") ||
    text.includes("tribal") ||
    text.includes("heritage") ||
    text.includes("museum") ||
    text.includes("festival")
  ) {
    return "Culture";
  }

  return "Culture";
}

/* =========================================================
   FIND IMAGE
========================================================= */

function findImage(element, $page, baseUrl) {
  let imageUrl = "";

  /* -------------------------------------------------------
     1. IMG INSIDE CARD
  ------------------------------------------------------- */

  const image = element.find("img").first();

  if (image.length) {
    imageUrl =
      image.attr("src") ||
      image.attr("data-src") ||
      image.attr("data-lazy-src") ||
      image.attr("data-original") ||
      image.attr("data-image") ||
      "";
  }

  /* -------------------------------------------------------
     2. SRCSET
  ------------------------------------------------------- */

  if (!imageUrl && image.length) {
    const srcset =
      image.attr("srcset") ||
      image.attr("data-srcset") ||
      "";

    if (srcset) {
      imageUrl = srcset.split(",")[0].trim().split(" ")[0];
    }
  }

  /* -------------------------------------------------------
     3. BACKGROUND IMAGE
  ------------------------------------------------------- */

  if (!imageUrl) {
    const style =
      element.attr("style") || "";

    const match = style.match(
      /url\(['"]?([^'")]+)['"]?\)/i
    );

    if (match) {
      imageUrl = match[1];
    }
  }

  /* -------------------------------------------------------
     4. DATA ATTRIBUTES
  ------------------------------------------------------- */

  if (!imageUrl) {
    const possibleAttributes = [
      "data-image",
      "data-bg",
      "data-background-image",
      "data-thumb",
      "data-src",
    ];

    for (const attr of possibleAttributes) {
      const value = element.attr(attr);

      if (value) {
        imageUrl = value;
        break;
      }
    }
  }

  return absoluteUrl(imageUrl, baseUrl);
}

/* =========================================================
   FIND DESCRIPTION
========================================================= */

function findDescription(element, name) {
  const selectors = [
    ".description",
    ".content",
    ".desc",
    ".tourist-description",
    ".field-content",
    "p",
  ];

  for (const selector of selectors) {
    const text = cleanText(
      element.find(selector).first().text()
    );

    if (
      text &&
      text.length > 20 &&
      text !== name
    ) {
      return text.slice(0, 800);
    }
  }

  return `Tourist destination of ${name}.`;
}

/* =========================================================
   FIND NAME
========================================================= */

function findName(element) {
  const selectors = [
    "h1",
    "h2",
    "h3",
    "h4",
    ".title",
    ".name",
    ".tourist-title",
    ".field-name-title",
    "a",
  ];

  for (const selector of selectors) {
    const value = cleanText(
      element.find(selector).first().text()
    );

    if (
      value &&
      value.length >= 2 &&
      value.length < 150
    ) {
      return value;
    }
  }

  return "";
}

/* =========================================================
   EXTRACT TOURIST CARDS
========================================================= */

function extractTouristPlaces(
  html,
  district,
  sourceUrl
) {
  const $ = cheerio.load(html);

  const places = [];

  /* -------------------------------------------------------
     CARD SELECTORS
  ------------------------------------------------------- */

  const selectors = [
    ".views-row",
    ".tourist-place",
    ".tourism-card",
    ".place-card",
    ".destination-card",
    ".card",
    "article",
    ".item",
    ".gallery-item",
  ];

  let cards = $();

  for (const selector of selectors) {
    const found = $(selector).filter(function () {
      const hasImage =
        $(this).find("img").length > 0;

      const text =
        cleanText($(this).text());

      return (
        hasImage &&
        text.length >= 3
      );
    });

    if (found.length > cards.length) {
      cards = found;
    }
  }

  /* -------------------------------------------------------
     PROCESS CARDS
  ------------------------------------------------------- */

  cards.each((index, element) => {
    const card = $(element);

    const name = findName(card);

    if (!name) return;

    const description =
      findDescription(card, name);

    const imageUrl =
      findImage(
        card,
        $,
        sourceUrl
      );

    const category =
      detectCategory(
        name,
        description
      );

    const link =
      card.find("a[href]").first().attr("href");

    const detailUrl =
      absoluteUrl(
        link,
        sourceUrl
      );

    places.push({
      district,
      name,
      category,
      description,
      imageUrl,
      sourceUrl:
        detailUrl || sourceUrl,
      verifiedDate: VERIFIED_DATE,
    });
  });

  return places;
}

/* =========================================================
   FALLBACK: PAGE IMAGE
========================================================= */

function findPageImages(
  html,
  sourceUrl,
  district
) {
  const $ = cheerio.load(html);

  const places = [];

  $("main img, .content img, article img").each(
    (index, element) => {
      const img = $(element);

      const src =
        img.attr("src") ||
        img.attr("data-src") ||
        img.attr("data-lazy-src");

      const imageUrl =
        absoluteUrl(
          src,
          sourceUrl
        );

      if (!imageUrl) return;

      const alt =
        cleanText(img.attr("alt"));

      if (!alt) return;

      if (
        alt.toLowerCase().includes("logo") ||
        alt.toLowerCase().includes("banner")
      ) {
        return;
      }

      places.push({
        district,
        name: alt,
        category: detectCategory(
          alt,
          ""
        ),
        description:
          `Tourist destination in ${district}.`,
        imageUrl,
        sourceUrl,
        verifiedDate: VERIFIED_DATE,
      });
    }
  );

  return places;
}

/* =========================================================
   REMOVE DUPLICATES
========================================================= */

function removeDuplicates(places) {
  const map = new Map();

  for (const place of places) {
    const key =
      `${place.district}-${place.name}`
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

    if (!map.has(key)) {
      map.set(key, place);
    }
  }

  return [...map.values()];
}

/* =========================================================
   FETCH DISTRICT
========================================================= */

async function scrapeDistrict(
  districtConfig
) {
  const {
    district,
    url,
  } = districtConfig;

  console.log(
    `\n🔎 ${district}`
  );

  console.log(
    `🌐 ${url}`
  );

  try {
    const response =
      await axios.get(url, {
        headers: HEADERS,
        timeout: 30000,
        maxRedirects: 5,
      });

    const html =
      response.data;

    let places =
      extractTouristPlaces(
        html,
        district,
        url
      );

    /* -------------------------------------------------------
       FALLBACK IMAGE EXTRACTION
    ------------------------------------------------------- */

    if (
      places.length === 0
    ) {
      places =
        findPageImages(
          html,
          url,
          district
        );
    }

    places =
      removeDuplicates(
        places
      );

    console.log(
      `✅ ${places.length} places found`
    );

    places.forEach((place) => {
      console.log(
        `   📍 ${place.name}`
      );

      console.log(
        `   🖼️ ${place.imageUrl || "NO IMAGE"}`
      );
    });

    return places;
  } catch (error) {
    console.log(
      `❌ Failed: ${district}`
    );

    console.log(
      `   ${error.message}`
    );

    return [];
  }
}

/* =========================================================
   MAIN
========================================================= */

async function seedTourism() {
  try {
    console.log(
      "\n======================================="
    );

    console.log(
      "🌿 CG DATA TOURISM SEED"
    );

    console.log(
      "=======================================\n"
    );

    await mongoose.connect(
      MONGODB_URI
    );

    console.log(
      "✅ MongoDB connected"
    );

    /* -------------------------------------------------------
       SCRAPE ALL DISTRICTS
    ------------------------------------------------------- */

    let allPlaces = [];

    for (const district of DISTRICTS) {
      const places =
        await scrapeDistrict(
          district
        );

      allPlaces.push(
        ...places
      );
    }

    /* -------------------------------------------------------
       REMOVE DUPLICATES
    ------------------------------------------------------- */

    allPlaces =
      removeDuplicates(
        allPlaces
      );

    console.log(
      `\n📊 Total places found: ${allPlaces.length}`
    );

    /* -------------------------------------------------------
       DELETE OLD TOURISM DATA
    ------------------------------------------------------- */

    await Tourism.deleteMany({});

    console.log(
      "🗑️ Old tourism data removed"
    );

    /* -------------------------------------------------------
       INSERT NEW DATA
    ------------------------------------------------------- */

    if (
      allPlaces.length > 0
    ) {
      await Tourism.insertMany(
        allPlaces
      );
    }

    /* -------------------------------------------------------
       SUMMARY
    ------------------------------------------------------- */

    const districts =
      new Set(
        allPlaces.map(
          (item) =>
            item.district
        )
      );

    const images =
      allPlaces.filter(
        (item) =>
          item.imageUrl
      );

    console.log(
      "\n======================================="
    );

    console.log(
      "🎉 TOURISM SEED COMPLETE"
    );

    console.log(
      "======================================="
    );

    console.log(
      `🏙️ Districts: ${districts.size}`
    );

    console.log(
      `📍 Places: ${allPlaces.length}`
    );

    console.log(
      `🖼️ Places with images: ${images.length}`
    );

    console.log(
      `⚠️ Places without images: ${
        allPlaces.length -
        images.length
      }`
    );

    console.log(
      "=======================================\n"
    );
  } catch (error) {
    console.error(
      "\n❌ Seed error:"
    );

    console.error(
      error
    );
  } finally {
    await mongoose.disconnect();

    console.log(
      "🔌 MongoDB disconnected"
    );
  }
}

/* =========================================================
   RUN
========================================================= */

seedTourism();