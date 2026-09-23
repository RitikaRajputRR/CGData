import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./DistrictDetails.css";

const API_URL = "http://192.168.1.198:5000/api/districts";

function DistrictDetails() {
  const { districtName } = useParams();
  const navigate = useNavigate();

  const selectedName = decodeURIComponent(districtName || "");

  const [district, setDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH DISTRICT
  // =========================================================

  useEffect(() => {
    const fetchDistrict = async () => {
      try {
        setLoading(true);
        setError("");
        setNotFound(false);

        const response = await fetch(
          `${API_URL}/${encodeURIComponent(selectedName)}`
        );

        if (response.status === 404) {
          setNotFound(true);
          setDistrict(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch district");
        }

        const data = await response.json();

        setDistrict(data);
      } catch (error) {
        console.error("District details error:", error);

        setError("Unable to load district information.");
      } finally {
        setLoading(false);
      }
    };

    if (selectedName) {
      fetchDistrict();
    } else {
      setLoading(false);
      setNotFound(true);
    }
  }, [selectedName]);

  // =========================================================
  // BACKEND IMAGE URL
  // =========================================================

  const getBackendImageUrl = (imagePath) => {
    if (!imagePath) {
      return "";
    }

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    return `http://192.168.1.198:5000${imagePath}`;
  };

  // =========================================================
  // FORMAT DATA
  // =========================================================

  const formatArrayValue = (value) => {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return "Information not available";
      }

      return value.join(", ");
    }

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "Information not available";
    }

    return value;
  };

  // =========================================================
  // COUNT ARRAY
  // =========================================================

  const getArrayCount = (value) => {
    if (Array.isArray(value)) {
      return value.length;
    }

    return 0;
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="district-details-page">
        <div className="not-found-card">
          <div className="not-found-icon">🌾</div>

          <h1>Loading District...</h1>

          <p>
            Please wait while district information is
            loading.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="district-details-page">
        <div className="not-found-card">
          <div className="not-found-icon">⚠️</div>

          <h1>Something went wrong</h1>

          <p>{error}</p>

          <button
            className="back-home-btn"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // NOT FOUND
  // =========================================================

  if (notFound || !district) {
    return (
      <div className="district-details-page">
        <div className="not-found-card">
          <div className="not-found-icon">🌾</div>

          <h1>District Not Found</h1>

          <p>
            Sorry, information for this district could not
            be found.
          </p>

          <button
            className="back-home-btn"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // DETAIL SECTIONS
  // =========================================================

  const detailSections = [
    {
      title: "Basic Information",
      icon: "📍",

      items: [
        ["District Name", district.districtName],
        ["Headquarters", district.headquarters],
        ["Area", district.area],
        ["Population", district.population],
        ["Description", district.description],
      ],
    },

    {
      title: "Agriculture & Food",
      icon: "🌾",

      items: [
        [
          "Major Crops / ODOP",
          district.agricultureMajorCrops,
        ],
        ["Famous Food", district.famousFood],
      ],
    },

    {
      title: "Government & Administration",
      icon: "🏛️",

      items: [
        [
          "Government Schemes",
          district.governmentSchemes,
        ],
        ["Municipalities", district.municipalities],
        ["Gram Panchayats", district.gramPanchayats],
        ["Blocks", district.blocks],
        ["Revenue Sub-Divisions", district.subdivisions],
        ["Tehsils / Sub-Districts", district.tehsils],
        ["Sub-Tehsils", district.subTehsils],
        ["Villages", district.villages],
      ],
    },

    {
      title: "Education & Health",
      icon: "🎓",

      items: [
        ["Schools", district.schools],
        ["Private Schools", district.privateSchools],
        [
          "Colleges / Universities",
          district.collegesUniversities,
        ],
        ["Private Colleges", district.privateColleges],
        [
          "Government Hospitals",
          district.governmentHospitals,
        ],
        ["Private Hospitals", district.privateHospitals],
        [
          "Government Medical College",
          district.governmentMedicalCollege,
        ],
        [
          "Private Medical Colleges",
          district.privateMedicalColleges,
        ],
        ["Clinics", district.clinics],
        ["Diagnostic Centres", district.diagnosticCentres],
        ["Blood Banks", district.bloodBanks],
      ],
    },

    {
      title: "Police & Emergency",
      icon: "🚨",

      items: [
        ["Police Stations", district.policeStations],
        ["Emergency Helplines", district.emergencyHelplines],
        ["SP Name", district.spName],
        ["SP Contact", district.spContact],
        ["Collector Name", district.collectorName],
        ["Collector Contact", district.collectorContact],
      ],
    },

    {
      title: "Transport & Connectivity",
      icon: "🚆",

      items: [
        ["Bus Stand", district.busStand],
        ["Railway Stations", district.railwayStations],
        ["Nearest Airport", district.nearestAirport],
        ["Major Cities / Towns", district.majorCitiesTowns],
      ],
    },

    {
      title: "Industry & Economy",
      icon: "🏭",

      items: [
        ["Major Industries", district.majorIndustries],
        ["Handicrafts", district.handicrafts],
      ],
    },

    {
      title: "Nature & Tourism",
      icon: "⛰️",

      items: [
        ["Natural Places", district.naturalPlaces],
        ["Tourist Places", district.touristPlaces],
        [
          "Wildlife / National Parks",
          district.wildlifeNationalParks,
        ],
        ["Religious Places", district.religiousPlaces],
      ],
    },

    {
      title: "Culture & Languages",
      icon: "🎭",

      items: [
        ["Festivals / Culture", district.festivalsCulture],
        ["Languages", district.languages],
      ],
    },

    {
      title: "Utilities",
      icon: "💧",

      items: [
        ["Electricity Contact", district.electricityContact],
        ["Water Supply Contact", district.waterSupplyContact],
        [
          "Animal / Veterinary Help",
          district.animalVeterinaryHelp,
        ],
      ],
    },
  ];

  return (
    <div className="district-details-page">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header className="details-header">

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        <div className="details-logo">
          <span>🌾</span>

          <div>
            <strong>CG DATA</strong>

            <small>
              Chhattisgarh Information Portal
            </small>
          </div>
        </div>

        <div className="header-badge">
          CHHATTISGARH
        </div>

      </header>

      {/* =====================================================
          HERO — SAME COMMON BANNER
      ===================================================== */}

      <section className="district-hero">

        {/* Common CG Tourism / Culture Banner */}

        <div className="hero-image">

          <img
            src="/images/banner.png"
            alt="Chhattisgarh Tourism and Culture"
            onError={(event) => {
              event.currentTarget.src =
                "/images/cg-banner.png";
            }}
          />

        </div>

        {/* Dark/cream overlay */}

        <div className="hero-overlay"></div>

        {/* Hero content */}

        <div className="hero-content">

          <span className="hero-label">
            DISTRICT PROFILE
          </span>

          <h1>
            {district.districtName}
          </h1>

          <p className="hero-location">
            📍{" "}
            {district.headquarters ||
              district.districtName}
          </p>

          <p className="hero-description">
            {district.description ||
              `Explore information about ${district.districtName} district of Chhattisgarh.`}
          </p>

        </div>

        {/* Agriculture badge */}

        <div className="hero-agriculture-badge">
          <span>🌾</span>

          <div>
            <small>
              CHHATTISGARH
            </small>

            <strong>
              Land of Paddy & Culture
            </strong>
          </div>
        </div>

      </section>

      {/* =====================================================
          DISTRICT GALLERY
      ===================================================== */}

      {district.imageGallery &&
        district.imageGallery.length > 0 && (

          <section className="district-gallery">

            <div className="gallery-heading">

              <span>
                DISTRICT VISUALS
              </span>

              <h2>
                Explore {district.districtName}
              </h2>

            </div>

            <div className="gallery-layout">

              <div className="gallery-main">

                <img
                  src={getBackendImageUrl(
                    district.imageGallery[0]
                  )}
                  alt={`${district.districtName} gallery`}
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />

              </div>

              <div className="gallery-grid">

                {district.imageGallery
                  .slice(1, 5)
                  .map((image, index) => (

                    <img
                      key={index}
                      src={getBackendImageUrl(image)}
                      alt={`${district.districtName} gallery ${
                        index + 2
                      }`}
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  ))}

              </div>

            </div>

          </section>

        )}

      {/* =====================================================
          QUICK STATS
      ===================================================== */}

      <section className="details-quick-stats">

        <div className="stat-card">

          <span className="stat-icon">
            👥
          </span>

          <div>
            <span>Population</span>

            <strong>
              {district.population || "—"}
            </strong>
          </div>

        </div>

        <div className="stat-card">

          <span className="stat-icon">
            📐
          </span>

          <div>
            <span>Area</span>

            <strong>
              {district.area || "—"}
            </strong>
          </div>

        </div>

        <div className="stat-card">

          <span className="stat-icon">
            🌾
          </span>

          <div>
            <span>Agriculture</span>

            <strong>
              {district.agricultureMajorCrops || "—"}
            </strong>
          </div>

        </div>

        <div className="stat-card">

          <span className="stat-icon">
            🍲
          </span>

          <div>
            <span>Famous Food</span>

            <strong>
              {district.famousFood || "—"}
            </strong>
          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN INFORMATION
      ===================================================== */}

      <main className="details-content">

        <div className="details-title">

          <span>
            COMPLETE INFORMATION
          </span>

          <h2>
            {district.districtName} District Details
          </h2>

          <p>
            Explore important information about the
            district, including administration,
            agriculture, education, tourism,
            culture and public services.
          </p>

        </div>

        {/* ===================================================
            ADMINISTRATION
        =================================================== */}

        <section className="about-district">

          <div className="about-heading">

            <span>
              ADMINISTRATION
            </span>

            <h2>
              Administrative Overview
            </h2>

          </div>

          <div className="details-quick-stats">

            <div className="stat-card">

              <span className="stat-icon">
                🏛️
              </span>

              <div>
                <span>
                  Revenue Sub-Divisions
                </span>

                <strong>
                  {getArrayCount(
                    district.subdivisions
                  )}
                </strong>
              </div>

            </div>

            <div className="stat-card">

              <span className="stat-icon">
                📋
              </span>

              <div>
                <span>
                  Tehsils
                </span>

                <strong>
                  {getArrayCount(
                    district.tehsils
                  )}
                </strong>
              </div>

            </div>

            <div className="stat-card">

              <span className="stat-icon">
                📑
              </span>

              <div>
                <span>
                  Sub-Tehsils
                </span>

                <strong>
                  {getArrayCount(
                    district.subTehsils
                  )}
                </strong>
              </div>

            </div>

          </div>

          <div className="information-grid">

            <div className="information-item">
              <span className="information-label">
                Revenue Sub-Divisions
              </span>

              <p>
                {formatArrayValue(
                  district.subdivisions
                )}
              </p>
            </div>

            <div className="information-item">
              <span className="information-label">
                Tehsils / Sub-Districts
              </span>

              <p>
                {formatArrayValue(
                  district.tehsils
                )}
              </p>
            </div>

            <div className="information-item">
              <span className="information-label">
                Sub-Tehsils
              </span>

              <p>
                {formatArrayValue(
                  district.subTehsils
                )}
              </p>
            </div>

            <div className="information-item">
              <span className="information-label">
                Blocks
              </span>

              <p>
                {formatArrayValue(
                  district.blocks
                )}
              </p>
            </div>

            <div className="information-item">
              <span className="information-label">
                Gram Panchayats
              </span>

              <p>
                {formatArrayValue(
                  district.gramPanchayats
                )}
              </p>
            </div>

            <div className="information-item">
              <span className="information-label">
                Villages
              </span>

              <p>
                {formatArrayValue(
                  district.villages
                )}
              </p>
            </div>

          </div>

        </section>

        {/* ===================================================
            INFORMATION SECTIONS
        =================================================== */}

        <div className="details-sections">

          {detailSections.map((section) => (

            <section
              className="information-section"
              key={section.title}
            >

              <div className="information-section-header">

                <div className="section-icon">
                  {section.icon}
                </div>

                <div>
                  <span>
                    CG DATA
                  </span>

                  <h3>
                    {section.title}
                  </h3>
                </div>

              </div>

              <div className="information-grid">

                {section.items.map(
                  ([label, value]) => (

                    <div
                      className="information-item"
                      key={label}
                    >

                      <span className="information-label">
                        {label}
                      </span>

                      <p>
                        {formatArrayValue(value)}
                      </p>

                    </div>

                  )
                )}

              </div>

            </section>

          ))}

        </div>

        {/* =====================================================
            ABOUT DISTRICT
        ===================================================== */}

        <section className="about-district">

          <div className="about-heading">

            <span>
              ABOUT THE DISTRICT
            </span>

            <h2>
              About {district.districtName}
            </h2>

          </div>

          <p>
            {district.description ||
              "District information will be available here."}
          </p>

        </section>

        {/* =====================================================
            VERIFICATION
        ===================================================== */}

        <section className="verification-card">

          <div className="verification-icon">
            ✓
          </div>

          <div>

            <h3>
              Information Verification
            </h3>

            <p>
              Data should be checked against the
              relevant official district or
              government source before being used
              for official purposes.
            </p>

            {district.lastVerifiedDate && (
              <small>
                Last verified:{" "}
                {district.lastVerifiedDate}
              </small>
            )}

            {district.sourceUrl && (
              <p>
                Source:{" "}

                <a
                  href={district.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official Source
                </a>
              </p>
            )}

            {district.officialWebsite && (
              <p>
                Official Website:{" "}

                <a
                  href={district.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Official Website
                </a>
              </p>
            )}

          </div>

        </section>

        {/* =====================================================
            BOTTOM ACTION
        ===================================================== */}

        <div className="details-bottom-action">

          <button
            className="back-home-btn"
            onClick={() => navigate("/")}
          >
            ← Explore Other Districts
          </button>

        </div>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="details-footer">

        <p>
          © 2026 CG DATA · Chhattisgarh Information Portal
        </p>

        <span>
          🌾 HUMAR CHHATTISGARH
        </span>

      </footer>

    </div>
  );
}

export default DistrictDetails;