import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import "./App.css";

import ChhattisgarhMap from "./components/ChhattisgarhMap";
import DistrictDetails from "./components/DistrictDetails";

import Districts from "./pages/Districts";
import Map from "./pages/Map";
import Agriculture from "./pages/Agriculture";
import Tourism from "./pages/Tourism";
import About from "./pages/About";

const API_URL = "http://192.168.1.198:5000/api/districts";

/* ================================================= */
/* ================= SITE ASSETS ==================== */
/* ================================================= */

const DISTRICT_BANNER =
  "/images/cg-district-banner.png";

/* ================================================= */
/* =============== DISTRICT HELPERS =============== */
/* ================================================= */

const normalizeDistrictName = (name = "") => {
  return String(name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/district/g, "")
    .replace(/[^a-z0-9]/g, "");
};

/* ================================================= */
/* =============== DISTRICT ALIASES =============== */
/* ================================================= */

const DISTRICT_ALIASES = {
  kabeerdham: "kabirdham",
  kabirdham: "kabirdham",

  balodabazar: "balodabazarbhatapara",
  balodabazarbhatapara: "balodabazarbhatapara",

  balrampur: "balrampurramanujganj",
  balrampurramanujganj:
    "balrampurramanujganj",

  gaurelapendra: "gaurelapendramarwahi",
  gaurelapendramarwahi:
    "gaurelapendramarwahi",

  janjgir: "janjgirchampa",
  janjgirchampa: "janjgirchampa",

  khairagarh:
    "khairagarhchhuikhadangandai",

  khairagarhchhuikhadangandai:
    "khairagarhchhuikhadangandai",

  manendragarh:
    "manendragarhchirmiribharatpur",

  manendragarhchirmiribharatpur:
    "manendragarhchirmiribharatpur",

  mohla:
    "mohlamanpurambagarhchowki",

  mohlamanpurambagarhchowki:
    "mohlamanpurambagarhchowki",

  sarangarh:
    "sarangarhbilaigarh",

  sarangarhbilaigarh:
    "sarangarhbilaigarh",

  balod: "balod",
  bastar: "bastar",
  bemetara: "bemetara",
  bijapur: "bijapur",
  bilaspur: "bilaspur",
  dantewada: "dantewada",
  dhamtari: "dhamtari",
  durg: "durg",
  gariaband: "gariaband",
  jashpur: "jashpur",
  kanker: "kanker",
  kondagaon: "kondagaon",
  korba: "korba",
  korea: "korea",
  mahasamund: "mahasamund",
  mungeli: "mungeli",
  narayanpur: "narayanpur",
  raigarh: "raigarh",
  raipur: "raipur",
  rajnandgaon: "rajnandgaon",
  sakti: "sakti",
  sukma: "sukma",
  surajpur: "surajpur",
  surguja: "surguja",
};

/* ================================================= */
/* ============ DISTRICT KEY FUNCTION ============= */
/* ================================================= */

const getDistrictKey = (name = "") => {
  const normalized = normalizeDistrictName(name);

  return (
    DISTRICT_ALIASES[normalized] ||
    normalized
  );
};

/* ================================================= */
/* ============ FIND MATCHING DISTRICT ============= */
/* ================================================= */

const findMatchingDistrict = (
  districts,
  mapName
) => {
  if (
    !mapName ||
    !Array.isArray(districts)
  ) {
    return null;
  }

  const targetKey =
    getDistrictKey(mapName);

  let matchedDistrict =
    districts.find(
      (district) =>
        getDistrictKey(
          district?.districtName
        ) === targetKey
    );

  if (matchedDistrict) {
    return matchedDistrict;
  }

  matchedDistrict =
    districts.find((district) => {
      const districtKey =
        getDistrictKey(
          district?.districtName
        );

      return (
        districtKey.includes(targetKey) ||
        targetKey.includes(districtKey)
      );
    });

  return matchedDistrict || null;
};

/* ================================================= */
/* ================= HOME PAGE ===================== */
/* ================================================= */

function HomePage() {
  const [districts, setDistricts] =
    useState([]);

  const [selectedDistrict, setSelectedDistrict] =
    useState("Raipur");

  const [searchText, setSearchText] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const navigate = useNavigate();

  /* ================================================= */
  /* =============== FETCH DISTRICTS ================ */
  /* ================================================= */

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "Fetching districts from:",
          API_URL
        );

        const response =
          await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch districts: ${response.status}`
          );
        }

        const data =
          await response.json();

        console.log(
          "District API response:",
          data
        );

        if (!Array.isArray(data)) {
          throw new Error(
            "District API did not return an array"
          );
        }

        setDistricts(data);

        const defaultDistrict =
          findMatchingDistrict(
            data,
            "Raipur"
          );

        if (defaultDistrict) {
          setSelectedDistrict(
            defaultDistrict.districtName
          );
        }
      } catch (error) {
        console.error(
          "District fetch error:",
          error
        );

        setError(
          "Unable to load district data. Please make sure the backend server is running on port 5000."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  /* ================================================= */
  /* =========== SELECTED DISTRICT OBJECT ============ */
  /* ================================================= */

  const district =
    findMatchingDistrict(
      districts,
      selectedDistrict
    ) || {
      districtName:
        selectedDistrict,

      population: "",
      agricultureMajorCrops: "",
      famousFood: "",
      description: "",
      majorIndustries: "",
      naturalPlaces: "",
      festivalsCulture: "",
      touristPlaces: "",
      area: "",
      blocks: "",
      tehsils: [],
      tehsilDetails: [],
      gramPanchayats: "",
      municipalities: "",
      emergencyHelplines: "",
      electricityContact: "",
      religiousPlaces: "",
      languages: "",
      imageUrl: "",
      imageGallery: [],
    };

  /* ================================================= */
  /* ============== DISTRICT CLICK =================== */
  /* ================================================= */

  const handleDistrictClick = (name) => {
    console.log(
      "Map district clicked:",
      name
    );

    const matchedDistrict =
      findMatchingDistrict(
        districts,
        name
      );

    if (matchedDistrict) {
      console.log(
        "Matched API district:",
        matchedDistrict.districtName
      );

      setSelectedDistrict(
        matchedDistrict.districtName
      );
    } else {
      console.warn(
        "District not found in API:",
        name
      );

      setSelectedDistrict(name);
    }
  };

  /* ================================================= */
  /* ================= SEARCH ======================== */
  /* ================================================= */

  const handleSearch = (event) => {
    const value =
      event.target.value;

    setSearchText(value);

    if (!value.trim()) {
      return;
    }

    const searchValue =
      getDistrictKey(value);

    const matchedDistrict =
      districts.find((item) => {
        const districtName =
          getDistrictKey(
            item?.districtName
          );

        return (
          districtName.includes(
            searchValue
          ) ||
          searchValue.includes(
            districtName
          )
        );
      });

    if (matchedDistrict) {
      setSelectedDistrict(
        matchedDistrict.districtName
      );
    }
  };

  /* ================================================= */
  /* ============== FULL DETAILS ==================== */
  /* ================================================= */

  const handleViewDetails = () => {
    navigate(
      `/district/${encodeURIComponent(
        district.districtName
      )}`
    );
  };

  /* ================================================= */
  /* ================= LOADING ======================= */
  /* ================================================= */

  if (loading) {
    return (
      <div className="app">
        <div className="map-loading">
          Loading Chhattisgarh district data...
        </div>
      </div>
    );
  }

  /* ================================================= */
  /* ================= ERROR ========================= */
  /* ================================================= */

  if (error) {
    return (
      <div className="app">
        <div className="map-error">
          {error}

          <div
            style={{
              marginTop: "20px",
              fontSize: "14px",
              opacity: 0.8,
            }}
          >
            API: {API_URL}
          </div>
        </div>
      </div>
    );
  }

  /* ================================================= */
  /* ================= MAIN UI ======================= */
  /* ================================================= */

  return (
    <div className="app">

      {/* ================================================= */}
      {/* ================= HEADER ======================== */}
      {/* ================================================= */}

      <header className="header">

        <Link
          to="/"
          className="logo-area"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div className="logo-icon">
            🌾
          </div>

          <div>
            <h1>
              CG DATA
            </h1>

            <p>
              Chhattisgarh Information Portal
            </p>
          </div>
        </Link>
{/* ================================================= */}
{/* ================= NAVIGATION ==================== */}
{/* ================================================= */}

<nav className="navbar">

  <Link
    to="/"
    className="nav-link active"
  >
    <span className="nav-icon">⌂</span>
    <span>Home</span>
  </Link>

  <Link
    to="/districts"
    className="nav-link"
  >
    <span className="nav-icon">📍</span>
    <span>Districts</span>
  </Link>

  <Link
    to="/map"
    className="nav-link"
  >
    <span className="nav-icon">🗺</span>
    <span>Map</span>
  </Link>

  <Link
    to="/agriculture"
    className="nav-link"
  >
    <span className="nav-icon">🌾</span>
    <span>Agriculture</span>
  </Link>

  <Link
    to="/tourism"
    className="nav-link"
  >
    <span className="nav-icon">🏞</span>
    <span>Tourism</span>
  </Link>

  <a
    href="/#food-culture"
    className="nav-link"
  >
    <span className="nav-icon">🍲</span>
    <span>Food & Culture</span>
  </a>

  <Link
    to="/about"
    className="nav-link"
  >
    <span className="nav-icon">ⓘ</span>
    <span>About</span>
  </Link>

</nav>

        {/* ================================================= */}
        {/* ================= SEARCH ======================== */}
        {/* ================================================= */}

        <div className="search-box">

          <input
            type="text"
            value={searchText}
            onChange={handleSearch}
            placeholder="Search district..."
          />

          <span>
            ⌕
          </span>

        </div>

      </header>

      {/* ================================================= */}
      {/* ================= MAIN ========================== */}
      {/* ================================================= */}

      <main>

        {/* ================================================= */}
        {/* ============ MAP + DISTRICT SECTION ============ */}
        {/* ================================================= */}

        <section
          className="main-grid"
          id="districts"
        >

          {/* ================================================= */}
          {/* ================= MAP CARD ===================== */}
          {/* ================================================= */}

          <div
            className="map-card"
            id="map"
          >

            <div className="map-heading">

              <div>
                <span className="map-eyebrow">
                  DISTRICT DIRECTORY
                </span>

                <h2>
                  CHHATTISGARH
                </h2>
              </div>

              <span className="district-count">
                {districts.length} DISTRICTS
              </span>

            </div>

            <div className="map-wrapper">

              <ChhattisgarhMap
                selectedDistrict={
                  district.districtName
                }
                onDistrictClick={
                  handleDistrictClick
                }
              />

            </div>

            <div className="map-hint">
              👆 Click on a district to view
              detailed information
            </div>

            {/* ================================================= */}
            {/* ================= AGRICULTURE =================== */}
            {/* ================================================= */}

            <div
              className="agriculture-line"
              id="agriculture"
            >
              <strong>Dhan</strong>
              {" · "}
              <strong>Gehu</strong>
              {" · "}
              <strong>Chana</strong>
              {" · "}
              <strong>Raher</strong>
              {" · "}
              <strong>Kodo</strong>
              {" · "}
              <strong>Kutki</strong>
              {" · "}
              <strong>Mahua</strong>
            </div>

          </div>

          {/* ================================================= */}
          {/* ============== DISTRICT INFORMATION ============ */}
          {/* ================================================= */}

          <div className="info-card">

            {/* ================================================= */}
            {/* ================= INFO BANNER ================== */}
            {/* ================================================= */}

            <div className="info-banner">

              <div className="info-banner-content">

                <span className="small-title">
                  DISTRICT INFORMATION
                </span>

                <h2>
                  {district.districtName}
                </h2>

                <span className="district-type">
                  📍 District
                </span>

              </div>

              {/* SAME BANNER FOR ALL DISTRICTS */}

             <div className="banner-image">
  <img
    src="/images/banner.png"
    alt="Chhattisgarh Tourism"
    onError={(event) => {
      event.currentTarget.src = "/images/cg-banner.png";
    }}
  />
</div>

            </div>

            {/* ================================================= */}
            {/* ================= QUICK INFO =================== */}
            {/* ================================================= */}

            <div className="quick-info">

              <div className="quick-card">

                <div className="quick-icon">
                  👥
                </div>

                <div>
                  <h4>
                    Population
                  </h4>

                  <p>
                    {district.population ||
                      "Information not available"}
                  </p>
                </div>

              </div>

              <div className="quick-card">

                <div className="quick-icon">
                  🌱
                </div>

                <div>
                  <h4>
                    Agriculture
                  </h4>

                  <p>
                    {district.agricultureMajorCrops ||
                      "Information not available"}
                  </p>
                </div>

              </div>

              <div className="quick-card">

                <div className="quick-icon">
                  🍲
                </div>

                <div>
                  <h4>
                    Famous Food
                  </h4>

                  <p>
                    {district.famousFood ||
                      "Information not available"}
                  </p>
                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* ================= ABOUT ========================= */}
            {/* ================================================= */}

            <div
              className="about-section"
              id="about"
            >

              <div className="section-title">

                <h3>
                  About {district.districtName}
                </h3>

                <span></span>

              </div>

              <p>
                {district.description ||
                  "District information will be available here."}
              </p>

            </div>

            {/* ================================================= */}
            {/* ================= DETAILS ======================= */}
            {/* ================================================= */}

            <div className="details-grid">

              <div className="detail-box">

                <span>⚙️</span>

                <div>
                  <h4>
                    Key Industries
                  </h4>

                  <p>
                    {district.majorIndustries ||
                      "Information not available"}
                  </p>
                </div>

              </div>

              <div className="detail-box">

                <span>🏛️</span>

                <div>
                  <h4>
                    Popular Places
                  </h4>

                  <p>
                    {district.naturalPlaces ||
                      "Information not available"}
                  </p>
                </div>

              </div>

              <div
                className="detail-box"
                id="culture"
              >

                <span>👥</span>

                <div>
                  <h4>
                    Culture
                  </h4>

                  <p>
                    {district.festivalsCulture ||
                      "Information not available"}
                  </p>
                </div>

              </div>

              <div
                className="detail-box"
                id="tourism"
              >

                <span>⛰️</span>

                <div>
                  <h4>
                    Tourism
                  </h4>

                  <p>
                    {district.touristPlaces ||
                      "Information not available"}
                  </p>
                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* ================= TEHSILS ======================= */}
            {/* ================================================= */}

            {district.tehsilDetails?.length > 0 && (

              <div className="about-section">

                <div className="section-title">

                  <h3>
                    Tehsils
                  </h3>

                  <span></span>

                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginTop: "15px",
                  }}
                >

                  {district.tehsilDetails.map(
                    (tehsil) => (

                      <span
                        key={
                          tehsil._id ||
                          tehsil.censusCode
                        }
                        style={{
                          padding:
                            "8px 12px",
                          borderRadius:
                            "20px",
                          background:
                            "#f3ead7",
                          border:
                            "1px solid #d8c7a3",
                          fontSize:
                            "14px",
                        }}
                      >

                        {tehsil.name}

                        {" · "}

                        <strong>
                          {tehsil.censusCode}
                        </strong>

                      </span>

                    )
                  )}

                </div>

              </div>

            )}

            {/* ================================================= */}
            {/* ============= ADMINISTRATION =================== */}
            {/* ================================================= */}

            <div className="details-grid">

              <div className="detail-box">

                <span>🏛️</span>

                <div>
                  <h4>
                    Blocks
                  </h4>

                  <p>
                    {district.blocks ||
                      "Information not available"}
                  </p>
                </div>

              </div>

              <div className="detail-box">

                <span>📍</span>

                <div>
                  <h4>
                    Headquarters
                  </h4>

                  <p>
                    {district.headquarters ||
                      "Information not available"}
                  </p>
                </div>

              </div>

              <div className="detail-box">

                <span>📐</span>

                <div>
                  <h4>
                    Area
                  </h4>

                  <p>
                    {district.area ||
                      "Information not available"}
                  </p>
                </div>

              </div>

              <div className="detail-box">

                <span>🗣️</span>

                <div>
                  <h4>
                    Languages
                  </h4>

                  <p>
                    {district.languages ||
                      "Information not available"}
                  </p>
                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* ================= FULL DETAILS ================== */}
            {/* ================================================= */}

            <button
              className="full-details-btn"
              onClick={
                handleViewDetails
              }
            >

              <span>
                View Full District Details
              </span>

              <span>
                →
              </span>

            </button>

          </div>

        </section>

        {/* ================================================= */}
        {/* ================= FOOD SECTION =================== */}
        {/* ================================================= */}

        <section
          className="food-section"
          id="food-culture"
        >

          <div className="food-intro">

            <span>
              TASTE · TRADITION · CULTURE
            </span>

            <h2>
              Flavours of Chhattisgarh
            </h2>

            <p>
              Discover the traditional food and
              agricultural identity of Chhattisgarh.
            </p>

            <button
              className="explore-food-btn"
              onClick={() => {
                document
                  .getElementById(
                    "food-culture"
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              Explore Food Culture →
            </button>

          </div>

          <div className="food-grid">

            {/* FARA */}

            <div className="food-card">
              <div className="food-image">
                <img
                  src="/images/food/Faraa.jpg"
                  alt="Fara"
                />
              </div>

              <div className="food-content">
                <h3>Fara</h3>
                <p>
                  A traditional Chhattisgarhi
                  rice-based food.
                </p>
              </div>
            </div>

            {/* CHILA */}

            <div className="food-card">
              <div className="food-image">
                <img
                  src="/images/food/Chilla.jpg"
                  alt="Chila"
                />
              </div>

              <div className="food-content">
                <h3>Chila</h3>
                <p>
                  A popular traditional dish
                  prepared from rice batter.
                </p>
              </div>
            </div>

            {/* MUTHIYA */}

            <div className="food-card">
              <div className="food-image">
                <img
                  src="/images/food/muthiya.JPG"
                  alt="Muthiya"
                />
              </div>

              <div className="food-content">
                <h3>Muthiya</h3>
                <p>
                  A popular traditional dish
                  prepared from rice flavours
                  and leftover rice.
                </p>
              </div>
            </div>

            {/* BARA */}

            <div className="food-card">
              <div className="food-image">
                <img
                  src="/images/food/bara.jpg"
                  alt="Bara"
                />
              </div>

              <div className="food-content">
                <h3>Bara</h3>
                <p>
                  A popular traditional dish
                  prepared from urad dal.
                </p>
              </div>
            </div>

            {/* BOREBASI */}

            <div className="food-card">
              <div className="food-image">
                <img
                  src="/images/food/borebasi.jpg"
                  alt="Borebasi"
                />
              </div>

              <div className="food-content">
                <h3>Borebasi</h3>
                <p>
                  A traditional Chhattisgarhi
                  rice-based food.
                </p>
              </div>
            </div>

            {/* DUBKI KADHI */}

            <div className="food-card">
              <div className="food-image">
                <img
                  src="/images/food/Dubkikadhi.jpeg"
                  alt="Dubki Kadhi"
                />
              </div>

              <div className="food-content">
                <h3>Dubki Kadhi</h3>
                <p>
                  A traditional Chhattisgarhi
                  kadhi.
                </p>
              </div>
            </div>

            {/* THETHARY */}

            <div className="food-card">
              <div className="food-image">
                <img
                  src="/images/food/Thethary.jpeg"
                  alt="Thethary"
                />
              </div>

              <div className="food-content">
                <h3>Thethary</h3>
                <p>
                  A traditional Chhattisgarhi
                  snack.
                </p>
              </div>
            </div>

            {/* BIJORI */}

            <div className="food-card">
              <div className="food-image">
                <img
                  src="/images/food/bijori.jpg"
                  alt="Bijori"
                />
              </div>

              <div className="food-content">
                <h3>Bijori</h3>
                <p>
                  A traditional Chhattisgarhi
                  snack.
                </p>
              </div>
            </div>

            {/* BADI */}

            <div className="food-card">
              <div className="food-image">
                <img
                  src="/images/food/badi.jpg"
                  alt="Badi"
                />
              </div>

              <div className="food-content">
                <h3>Badi Saag</h3>
                <p>
                  A traditional Chhattisgarhi
                  curry.
                </p>
              </div>
            </div>

            {/* GIMIKANDA */}

            <div className="food-card">
              <div className="food-image">
                <img
                  src="/images/food/Suran.jpg"
                  alt="Gimikanda"
                />
              </div>

              <div className="food-content">
                <h3>Gimikanda</h3>
                <p>
                  A traditional Chhattisgarhi
                  saag.
                </p>
              </div>
            </div>

            {/* ANGAKAR ROTI */}

            <div className="food-card">
              <div className="food-image">
                <img
                  src="/images/food/Angakar_roti.jpg"
                  alt="Angakar Roti"
                />
              </div>

              <div className="food-content">
                <h3>Angakar Roti</h3>
                <p>
                  A traditional Chhattisgarhi
                  food.
                </p>
              </div>
            </div>

            {/* CHOSELA */}

            <div className="food-card">
              <div className="food-image">
                <img
                  src="/images/food/chaosela.jpeg"
                  alt="Chosela"
                />
              </div>

              <div className="food-content">
                <h3>Chosela</h3>
                <p>
                  A traditional Chhattisgarhi
                  rice-based puri.
                </p>
              </div>
            </div>

            {/* AIRSA */}

            <div className="food-card">
              <div className="food-image">
                <img
                  src="/images/sweets/airsa.jpg"
                  alt="Airsa"
                />
              </div>

              <div className="food-content">
                <h3>Airsa</h3>
                <p>
                  A traditional Chhattisgarhi
                  sweet snack.
                </p>
              </div>
            </div>

            {/* GULGULA */}

            <div className="food-card">
              <div className="food-image">
                <img
                  src="/images/sweets/gulgula.jpg"
                  alt="Gulgula Bhajiya"
                />
              </div>

              <div className="food-content">
                <h3>Gulgula Bhajiya</h3>
                <p>
                  A traditional Chhattisgarhi
                  sweet snack.
                </p>
              </div>
            </div>

            {/* PIDIYA */}

            <div className="food-card">
              <div className="food-image">
                <img
                  src="/images/sweets/pidiya.jpeg"
                  alt="Pidiya"
                />
              </div>

              <div className="food-content">
                <h3>Pidiya</h3>
                <p>
                  A traditional Chhattisgarhi
                  sweet food.
                </p>
              </div>
            </div>

            {/* TIKHUR */}

            <div className="food-card">
              <div className="food-image">
                <img
                  src="/images/sweets/Tikhur.jpeg"
                  alt="Tikhur"
                />
              </div>

              <div className="food-content">
                <h3>Tikhur</h3>
                <p>
                  A traditional Chhattisgarhi
                  sweet dish.
                </p>
              </div>
            </div>

            {/* KHURMI */}

            <div className="food-card">
              <div className="food-image">
                <img
                  src="/images/sweets/khurmi.jpg"
                  alt="Khurmi"
                />
              </div>

              <div className="food-content">
                <h3>Khurmi</h3>
                <p>
                  A traditional Chhattisgarhi
                  sweet snack.
                </p>
              </div>
            </div>

            {/* DEHRORI */}

            <div className="food-card">
              <div className="food-image">
                <img
                  src="/images/sweets/dehrori.jpg"
                  alt="Dehrori"
                />
              </div>

              <div className="food-content">
                <h3>Dehrori</h3>
                <p>
                  A rich traditional dessert
                  made from rice, curd and
                  sugar syrup.
                </p>
              </div>
            </div>

          </div>

        </section>

      </main>

      {/* ================================================= */}
      {/* ================= FOOTER ======================== */}
      {/* ================================================= */}

      <footer className="footer">

        <p>
          © 2026 CG DATA · Chhattisgarh Information Portal
        </p>

      </footer>

    </div>
  );
}

/* ================================================= */
/* ================= MAIN APP ====================== */
/* ================================================= */

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/districts"
        element={<Districts />}
      />

      <Route
        path="/map"
        element={<Map />}
      />

      <Route
        path="/agriculture"
        element={<Agriculture />}
      />

      <Route
        path="/tourism"
        element={<Tourism />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/district/:districtName"
        element={<DistrictDetails />}
      />

    </Routes>
  );
}

export default App;