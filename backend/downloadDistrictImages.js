const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const IMAGE_ROOT = path.join(
  PROJECT_ROOT,
  "public",
  "images",
  "districts"
);

const DISTRICTS = [
  { name: "Balod", folder: "Balod" },
  { name: "Baloda Bazar-Bhatapara", folder: "balodabazarbhatapara" },
  { name: "Balrampur-Ramanujganj", folder: "balrampurramanujganj" },
  { name: "Bastar", folder: "Bastar" },
  { name: "Bemetara", folder: "Bemetara" },
  { name: "Bijapur", folder: "Bijapur" },
  { name: "Bilaspur", folder: "Bilaspur" },
  { name: "Dantewada", folder: "Dantewada" },
  { name: "Dhamtari", folder: "Dhamtari" },
  { name: "Durg", folder: "Durg" },
  { name: "Gariaband", folder: "Gariaband" },
  { name: "Gaurela-Pendra-Marwahi", folder: "gaurelapendramarwahi" },
  { name: "Janjgir-Champa", folder: "janjgirchampa" },
  { name: "Jashpur", folder: "Jashpur" },
  { name: "Kabirdham", folder: "Kabirdham" },
  { name: "Kanker", folder: "Kanker" },
  {
    name: "Khairagarh-Chhuikhadan-Gandai",
    folder: "khairagarhchhuikhadangandai",
  },
  { name: "Kondagaon", folder: "Kondagaon" },
  { name: "Korba", folder: "Korba" },
  { name: "Korea", folder: "Korea" },
  { name: "Mahasamund", folder: "mahasamund" },
  {
    name: "Manendragarh-Chirmiri-Bharatpur",
    folder: "manendragarhchirmiribharatpur",
  },
  {
    name: "Mohla-Manpur-Ambagarh Chowki",
    folder: "mohlamanpurambagarhchowki",
  },
  { name: "Mungeli", folder: "Mungeli" },
  { name: "Narayanpur", folder: "Narayanpur" },
  { name: "Raigarh", folder: "Raigarh" },
  { name: "Raipur", folder: "Raipur" },
  { name: "Rajnandgaon", folder: "Rajnandgaon" },
  { name: "Sakti", folder: "Sakti" },
  { name: "Sarangarh-Bilaigarh", folder: "sarangarhbilaigarh" },
  { name: "Sukma", folder: "Sukma" },
  { name: "Surajpur", folder: "Surajpur" },
  { name: "Surguja", folder: "Surguja" },
];

const API_URL = "https://commons.wikimedia.org/w/api.php";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeFileName(name, index, ext = ".jpg") {
  return `${String(index).padStart(2, "0")}_${name
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_")}${ext}`;
}

async function searchImages(district) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `"${district}" Chhattisgarh`,
    gsrnamespace: "6",
    gsrlimit: "20",
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "1600",
    format: "json",
    origin: "*",
  });

  const response = await fetch(`${API_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Wikimedia API error: ${response.status}`);
  }

  const data = await response.json();

  return Object.values(data.query?.pages || {});
}

function isUsefulImage(page) {
  const info = page.imageinfo?.[0];

  if (!info?.thumburl && !info?.url) {
    return false;
  }

  const title = (page.title || "").toLowerCase();

  const badWords = [
    "map",
    "logo",
    "flag",
    "icon",
    "coat of arms",
    "locator",
    "administrative",
    "districts map",
  ];

  return !badWords.some((word) => title.includes(word));
}

function getLicense(info) {
  const metadata = info.extmetadata || {};

  return {
    license:
      metadata.LicenseShortName?.value ||
      metadata.License?.value ||
      "See Wikimedia Commons source page",
    artist:
      metadata.Artist?.value ||
      metadata.Credit?.value ||
      "Not specified",
    source: info.descriptionurl || info.url,
  };
}

async function downloadImage(url, destination) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Download failed: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(destination, buffer);
}

async function processDistrict(district, districtNumber) {
  const folderPath = path.join(IMAGE_ROOT, district.folder);

  fs.mkdirSync(folderPath, { recursive: true });

  console.log(
    `\n[${districtNumber}/${DISTRICTS.length}] ${district.name}`
  );

  try {
    let pages = await searchImages(district.name);

    pages = pages.filter(isUsefulImage);

    const selected = pages.slice(0, 5);

    if (selected.length === 0) {
      console.log("  ❌ No suitable images found");
      return 0;
    }

    const sources = [];
    let downloaded = 0;

    for (let i = 0; i < selected.length; i++) {
      const page = selected[i];
      const info = page.imageinfo[0];

      const imageUrl = info.thumburl || info.url;

      let extension = ".jpg";

      if (imageUrl.includes(".png")) extension = ".png";
      if (imageUrl.includes(".webp")) extension = ".webp";
      if (imageUrl.includes(".jpeg")) extension = ".jpeg";

      const filename = safeFileName(
        district.name,
        i + 1,
        extension
      );

      const destination = path.join(folderPath, filename);

      try {
        await downloadImage(imageUrl, destination);

        sources.push({
          filename,
          wikimediaTitle: page.title,
          sourcePage: info.descriptionurl,
          imageUrl: info.url,
          license: getLicense(info),
        });

        downloaded++;

        console.log(`  ✅ ${filename}`);
      } catch (error) {
        console.log(
          `  ⚠️ Failed: ${page.title} - ${error.message}`
        );
      }

      await sleep(300);
    }

    const sourceFile = path.join(folderPath, "sources.json");

    fs.writeFileSync(
      sourceFile,
      JSON.stringify(sources, null, 2),
      "utf8"
    );

    console.log(`  📸 Downloaded: ${downloaded}/5`);

    return downloaded;
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return 0;
  }
}

async function main() {
  console.log("==============================================");
  console.log(" CG DATA - District Image Downloader");
  console.log(" Source: Wikimedia Commons");
  console.log(" Target: 33 districts × 5 images");
  console.log("==============================================");

  let totalDownloaded = 0;

  for (let i = 0; i < DISTRICTS.length; i++) {
    totalDownloaded += await processDistrict(
      DISTRICTS[i],
      i + 1
    );

    await sleep(500);
  }

  console.log("\n==============================================");
  console.log("DOWNLOAD COMPLETE");
  console.log(`Districts: ${DISTRICTS.length}`);
  console.log(`Images downloaded: ${totalDownloaded}`);
  console.log("==============================================");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
