import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import "./Districts.css";

const API_URL = "https://cgdata-backend.onrender.com/api/districts";

// Common Chhattisgarh banner
const DISTRICT_BANNER = "/images/banner.png";

function Districts() {
  const [districts, setDistricts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH ALL DISTRICTS
  // =========================================================

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch districts: ${response.status}`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid district API response");
        }

        setDistricts(data);
      } catch (error) {
        console.error("District fetch error:", error);

        setError("Unable to load district data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredDistricts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return districts;
    }

    return districts.filter((district) =>
      district?.districtName
        ?.toLowerCase()
        .includes(searchValue)
    );
  }, [districts, search]);

  // =========================================================
  // TOTAL DISTRICTS
  // =========================================================

  const totalDistricts = districts.length;

  // =========================================================
  // TOTAL TEHSILS
  // =========================================================

  const totalTehsils = districts.reduce(
    (total, district) => {
      if (Array.isArray(district?.tehsilDetails)) {
        return total + district.tehsilDetails.length;
      }

      if (Array.isArray(district?.tehsils)) {
        return total + district.tehsils.length;
      }

      return total;
    },
    0
  );

  // =========================================================
  // IMAGE ERROR HANDLER
  // =========================================================

  const handleBannerError = (event) => {
    event.currentTarget.style.display = "none";

    const parent = event.currentTarget.parentElement;

    if (parent) {
      parent.classList.add("banner-image-fallback");
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="district-page">

        <section className="district-loading-card">

          <div className="loading-icon">
            🌾
          </div>

          <h2>
            Loading Chhattisgarh Districts
          </h2>

          <p>
            Please wait while district information
            is being loaded.
          </p>

        </section>

      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="district-page">

        <section className="district-error-card">

          <div className="error-icon">
            ⚠️
          </div>

          <h2>
            Unable to Load Districts
          </h2>

          <p>
            {error}
          </p>

          <small>
            Make sure the CG DATA backend is running
            on port 5000.
          </small>

        </section>

      </div>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div className="district-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="district-header">

        <div className="district-header-content">

          <span className="district-eyebrow">
            CHHATTISGARH
          </span>

          <h1>
            District Directory
          </h1>

          <p>
            Explore district-wise information,
            administration, agriculture, culture
            and tourism.
          </p>

        </div>

        <div className="district-header-art">

          <div className="header-art-circle">
            🌾
          </div>

        </div>

      </section>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="district-stats">

        {/* DISTRICTS */}

        <div className="stat-card">

          <div className="stat-icon">
            📍
          </div>

          <div className="stat-content">

            <strong>
              {totalDistricts}
            </strong>

            <span>
              Districts
            </span>

          </div>

        </div>

        {/* TEHSILS */}

        <div className="stat-card">

          <div className="stat-icon">
            🏛️
          </div>

          <div className="stat-content">

            <strong>
              {totalTehsils}
            </strong>

            <span>
              Tehsil Records
            </span>

          </div>

        </div>

        {/* CG DISTRICTS */}

        <div className="stat-card">

          <div className="stat-icon">
            🌾
          </div>

          <div className="stat-content">

            <strong>
              33
            </strong>

            <span>
              CG Districts
            </span>

          </div>

        </div>

      </section>

      {/* =====================================================
          SEARCH TOOLBAR
      ===================================================== */}

      <section className="district-toolbar">

        <div className="district-search">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search district..."
            aria-label="Search district"
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

        </div>

        <span className="result-count">

          {filteredDistricts.length}{" "}
          {filteredDistricts.length === 1
            ? "district"
            : "districts"}

        </span>

      </section>

      {/* =====================================================
          DISTRICT GRID
      ===================================================== */}

      {filteredDistricts.length > 0 && (

        <section className="district-grid">

          {filteredDistricts.map((district) => (

            <article
              className="district-card"
              key={
                district._id ||
                district.districtName
              }
            >

              {/* =================================================
                  COMMON CHHATTISGARH BANNER
              ================================================= */}

              <div className="district-banner">

                <img
                  src={DISTRICT_BANNER}
                  alt="Chhattisgarh Tourism"
                  loading="lazy"
                  onError={handleBannerError}
                />

                <div className="district-banner-overlay">

                  <span>
                    CHHATTISGARH TOURISM
                  </span>

                  <small>
                    HUMAR CHHATTISGARH
                  </small>

                </div>

              </div>

              {/* =================================================
                  CARD CONTENT
              ================================================= */}

              <div className="district-card-content">

                {/* DISTRICT TITLE */}

                <div className="district-card-heading">

                  <div>

                    <span className="district-label">
                      DISTRICT
                    </span>

                    <h2>
                      {district.districtName}
                    </h2>

                  </div>

                  <span className="district-pin">
                    📍
                  </span>

                </div>

                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <div className="district-info-list">

                  {/* HEADQUARTERS */}

                  <div className="district-info-item">

                    <span>
                      Headquarters
                    </span>

                    <strong>
                      {district.headquarters ||
                        "Information not available"}
                    </strong>

                  </div>

                  {/* AREA */}

                  <div className="district-info-item">

                    <span>
                      Area
                    </span>

                    <strong>
                      {district.area ||
                        "Information not available"}
                    </strong>

                  </div>

                  {/* POPULATION */}

                  <div className="district-info-item">

                    <span>
                      Population
                    </span>

                    <strong>
                      {district.population ||
                        "Information not available"}
                    </strong>

                  </div>

                  {/* TEHSILS */}

                  <div className="district-info-item">

                    <span>
                      Tehsils
                    </span>

                    <strong>

                      {Array.isArray(
                        district.tehsilDetails
                      )
                        ? district.tehsilDetails.length
                        : Array.isArray(
                            district.tehsils
                          )
                        ? district.tehsils.length
                        : 0}

                    </strong>

                  </div>

                </div>

                {/* =================================================
                    AGRICULTURE
                ================================================= */}

                <div className="district-mini-section">

                  <div className="mini-section-title">

                    <span className="mini-icon">
                      🌾
                    </span>

                    <span>
                      Agriculture
                    </span>

                  </div>

                  <p>
                    {district.agricultureMajorCrops ||
                      "Information not available"}
                  </p>

                </div>

                {/* =================================================
                    TOURISM
                ================================================= */}

                <div className="district-mini-section">

                  <div className="mini-section-title">

                    <span className="mini-icon">
                      🏞️
                    </span>

                    <span>
                      Tourism
                    </span>

                  </div>

                  <p>
                    {district.touristPlaces ||
                      district.naturalPlaces ||
                      "Information not available"}
                  </p>

                </div>

                {/* =================================================
                    VIEW DETAILS BUTTON
                ================================================= */}

                <Link
                  className="district-details-btn"
                  to={`/district/${encodeURIComponent(
                    district.districtName
                  )}`}
                >

                  <span>
                    View District Details
                  </span>

                  <span className="details-arrow">
                    →
                  </span>

                </Link>

              </div>

            </article>

          ))}

        </section>

      )}

      {/* =====================================================
          NO SEARCH RESULT
      ===================================================== */}

      {filteredDistricts.length === 0 && (

        <section className="district-empty">

          <div className="empty-icon">
            🔍
          </div>

          <h3>
            District Not Found
          </h3>

          <p>
            No district matches{" "}
            <strong>
              "{search}"
            </strong>.
          </p>

          <button
            type="button"
            className="empty-reset-btn"
            onClick={() => setSearch("")}
          >
            Show All Districts
          </button>

        </section>

      )}

      {/* =====================================================
          FOOTER NOTE
      ===================================================== */}

      <div className="district-page-note">

        <span>
          🌾
        </span>

        <p>
          CG DATA · Chhattisgarh District
          Information Portal
        </p>

      </div>

    </div>
  );
}

export default Districts;