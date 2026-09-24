import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Tourism.css";

/* =========================================================
   API
========================================================= */

const API_URL = "http://localhost:5000/api/tourism";

// Production:
// const API_URL = "https://cgdata-backend.onrender.com/api/tourism";

/* =========================================================
   COMMON BANNER
========================================================= */

const TOURISM_BANNER = "/images/banner.png";

/* =========================================================
   CATEGORIES
========================================================= */

const CATEGORY_LIST = [
  "All",
  "Waterfall",
  "Temple",
  "Forest",
  "Wildlife",
  "Culture",
];

/* =========================================================
   IMAGE HELPER
========================================================= */

const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return TOURISM_BANNER;
  }

  /*
  Local frontend path:
  /images/tourism/Amritdhara.jpg  */
  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }

  /*
  External image
  */
  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  return TOURISM_BANNER;
};

/* =========================================================
   CATEGORY MATCH
========================================================= */

const categoryMatches = (item, selectedCategory) => {
  if (selectedCategory === "All") {
    return true;
  }

  if (selectedCategory === "Wildlife") {
    return (
      item.category === "Wildlife" ||
      item.category === "Forest"
    );
  }

  return item.category === selectedCategory;
};

/* =========================================================
   TOURISM PAGE
========================================================= */

export default function Tourism() {
  const [tourismData, setTourismData] = useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedPlace, setSelectedPlace] =
    useState(null);

  /* =======================================================
     FETCH TOURISM
  ======================================================= */

  useEffect(() => {
    const fetchTourism = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Tourism API error: ${response.status}`
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message ||
              "Tourism API returned an error."
          );
        }

        if (!Array.isArray(result.data)) {
          throw new Error(
            "Tourism API data is not an array."
          );
        }

        setTourismData(result.data);
      } catch (err) {
        console.error(
          "Tourism fetch error:",
          err
        );

        setError(
          "Tourism data load nahi ho pa raha hai."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTourism();
  }, []);

  /* =======================================================
     FILTER DATA
  ======================================================= */

  const filteredData = useMemo(() => {
    const search = searchText
      .trim()
      .toLowerCase();

    return tourismData.filter((item) => {
      const matchesCategory =
        categoryMatches(
          item,
          selectedCategory
        );

      if (!matchesCategory) {
        return false;
      }

      if (!search) {
        return true;
      }

      return (
        item.district
          ?.toLowerCase()
          .includes(search) ||
        item.name
          ?.toLowerCase()
          .includes(search) ||
        item.description
          ?.toLowerCase()
          .includes(search) ||
        item.category
          ?.toLowerCase()
          .includes(search)
      );
    });
  }, [
    tourismData,
    selectedCategory,
    searchText,
  ]);

  /* =======================================================
     GROUP BY DISTRICT
  ======================================================= */

  const groupedDistricts = useMemo(() => {
    const groups = {};

    filteredData.forEach((item) => {
      if (!groups[item.district]) {
        groups[item.district] = [];
      }

      groups[item.district].push(item);
    });

    return groups;
  }, [filteredData]);

  /* =======================================================
     CATEGORY COUNTS
  ======================================================= */

  const categoryCounts = useMemo(() => {
    const counts = {
      All: tourismData.length,
      Waterfall: 0,
      Temple: 0,
      Forest: 0,
      Wildlife: 0,
      Culture: 0,
    };

    tourismData.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }

      if (
        item.category === "Forest"
      ) {
        counts.Wildlife++;
      }
    });

    return counts;
  }, [tourismData]);

  /* =======================================================
     IMAGE ERROR FALLBACK
  ======================================================= */

  const handleImageError = (event) => {
    if (
      event.currentTarget.src.includes(
        TOURISM_BANNER
      )
    ) {
      return;
    }

    event.currentTarget.src =
      TOURISM_BANNER;
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="tourism-page">
        <div className="tourism-loading">
          <div className="tourism-spinner"></div>

          <h2>
            Loading Chhattisgarh Tourism...
          </h2>

          <p>
            Official tourism information is
            being loaded.
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <div className="tourism-page">
        <section className="tourism-error">
          <div className="error-icon">
            ⚠️
          </div>

          <h2>
            Tourism data unavailable
          </h2>

          <p>{error}</p>

          <button
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>
        </section>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="tourism-page">

      {/* ===================================================
          HERO
      =================================================== */}

      <section className="tourism-hero">

        <img
          src={TOURISM_BANNER}
          alt="Chhattisgarh tourism"
          className="tourism-hero-image"
        />

        <div className="tourism-hero-overlay"></div>

        <div className="tourism-hero-content">

          <span className="hero-small">
            Explore Chhattisgarh
          </span>

          <h1>
            HUMAR
            <br />
            CHHATTISGARH
          </h1>

          <p>
            Waterfalls • Temples • Forests •
            Culture
          </p>

        </div>

      </section>

      {/* ===================================================
          INTRO
      =================================================== */}

      <section className="tourism-intro">

        <div className="intro-badge">
          🌿 Tourism
        </div>

        <h2>
          Discover the beauty of Chhattisgarh
        </h2>

        <p>
          Explore officially listed tourist
          places, waterfalls, temples,
          forests and cultural destinations
          across Chhattisgarh.
        </p>

      </section>

      {/* ===================================================
          FILTER SECTION
      =================================================== */}

      <section className="tourism-controls">

        <div className="category-section">

          <div className="section-label">
            Explore by category
          </div>

          <div className="category-pills">

            {CATEGORY_LIST.map(
              (category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    selectedCategory ===
                    category
                      ? "category-pill active"
                      : "category-pill"
                  }
                  onClick={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                >
                  <span>
                    {category}
                  </span>

                  <small>
                    {
                      categoryCounts[
                        category
                      ]
                    }
                  </small>
                </button>
              )
            )}

          </div>

        </div>

        {/* SEARCH */}

        <div className="tourism-search">

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value
              )
            }
            placeholder="Search tourist place or district..."
          />

          {searchText && (
            <button
              type="button"
              className="clear-search"
              onClick={() =>
                setSearchText("")
              }
            >
              ×
            </button>
          )}

        </div>

      </section>

      {/* ===================================================
          RESULT SUMMARY
      =================================================== */}

      <section className="tourism-summary">

        <div>
          <strong>
            {filteredData.length}
          </strong>

          <span>
            tourist places
          </span>
        </div>

        <div>
          <strong>
            {
              Object.keys(
                groupedDistricts
              ).length
            }
          </strong>

          <span>
            districts shown
          </span>
        </div>

      </section>

      {/* ===================================================
          DISTRICT CARDS
      =================================================== */}

      <main className="tourism-content">

        {Object.keys(
          groupedDistricts
        ).length === 0 ? (

          <section className="tourism-no-results">

            <div className="no-result-icon">
              🌾
            </div>

            <h2>
              No tourism places found
            </h2>

            <p>
              Try another category or
              search term.
            </p>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory(
                  "All"
                );

                setSearchText("");
              }}
            >
              Reset Filters
            </button>

          </section>

        ) : (

          Object.entries(
            groupedDistricts
          ).map(
            ([
              district,
              places,
            ]) => (

              <section
                className="district-tourism-section"
                key={district}
              >

                {/* DISTRICT HEADER */}

                <div className="district-tourism-header">

                  <div>

                    <span>
                      Chhattisgarh Tourism
                    </span>

                    <h2>
                      {district}
                    </h2>

                  </div>

                  <div className="district-place-count">
                    <strong>
                      {places.length}
                    </strong>

                    <span>
                      Places
                    </span>
                  </div>

                </div>

                {/* GALLERY */}

                <div className="tourism-gallery">

                  {places.map(
                    (item) => {

                      const image =
                        getImageUrl(
                          item.imageUrl
                        );

                      return (
                        <article
                          className="tourism-card"
                          key={
                            item._id ||
                            `${item.district}-${item.name}`
                          }
                        >

                          {/* IMAGE */}

                          <div className="tourism-card-image-wrap">

                            <img
                              src={image}
                              alt={
                                item.name
                              }
                              className="tourism-card-image"
                              loading="lazy"
                              onError={
                                handleImageError
                              }
                            />

                            <div className="image-overlay"></div>

                            <span className="tourism-category">
                              {item.category}
                            </span>

                            {item.imageUrl && (
                              <span className="real-image-badge">
                                Photo
                              </span>
                            )}

                          </div>

                          {/* CONTENT */}

                          <div className="tourism-card-content">

                            <h3>
                              {item.name}
                            </h3>

                            <p>
                              {item.description ||
                                "Tourist destination listed by the district administration."}
                            </p>

                            <div className="tourism-card-meta">

                              <span>
                                📍{" "}
                                {item.district}
                              </span>

                              {item.verifiedDate && (
                                <span>
                                  ✓ Verified{" "}
                                  {
                                    item.verifiedDate
                                  }
                                </span>
                              )}

                            </div>

                            <div className="tourism-card-actions">

                              <button
                                type="button"
                                className="explore-btn"
                                onClick={() =>
                                  setSelectedPlace(
                                    item
                                  )
                                }
                              >
                                View Details
                                <span>
                                  →
                                </span>
                              </button>

                              {item.sourceUrl && (
                                <a
                                  href={
                                    item.sourceUrl
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="source-link"
                                >
                                  Official Source ↗
                                </a>
                              )}

                            </div>

                          </div>

                        </article>
                      );
                    }
                  )}

                </div>

              </section>

            )
          )

        )}

      </main>

      {/* ===================================================
          CULTURE SECTION
      =================================================== */}

      <section className="tourism-culture">

        <div className="culture-pattern"></div>

        <div className="culture-content">

          <span>
            HUMAR CHHATTISGARH
          </span>

          <h2>
            Nature, Culture & Tradition
          </h2>

          <p>
            From waterfalls and forests to
            temples and traditional cultural
            destinations, Chhattisgarh offers
            diverse places to explore.
          </p>

        </div>

      </section>

      {/* ===================================================
          OFFICIAL DATA NOTE
      =================================================== */}

      <section className="tourism-data-note">

        <div className="data-note-icon">
          ✓
        </div>

        <div>

          <h3>
            Officially sourced information
          </h3>

          <p>
            Tourism information is stored
            separately in the CG DATA
            Tourism database with its
            corresponding source URL and
            verification date.
          </p>

        </div>

      </section>

      {/* ===================================================
          BOTTOM BANNER
      =================================================== */}

      <section className="tourism-bottom">

        <img
          src={TOURISM_BANNER}
          alt=""
          onError={handleImageError}
        />

        <div className="tourism-bottom-overlay"></div>

        <div className="tourism-bottom-content">

          <h2>
            HUMAR CHHATTISGARH
          </h2>

          <p>
            Explore • Experience • Remember
          </p>

          <Link
            to="/"
            className="back-home-btn"
          >
            ← Back to CG DATA
          </Link>

        </div>

      </section>

      {/* ===================================================
          LIGHTBOX
      =================================================== */}

      {selectedPlace && (

        <div
          className="tourism-lightbox"
          onClick={() =>
            setSelectedPlace(null)
          }
        >

          <div
            className="lightbox-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="lightbox-close"
              onClick={() =>
                setSelectedPlace(null)
              }
            >
              ×
            </button>

            <div className="lightbox-image-wrap">

              <img
                src={getImageUrl(
                  selectedPlace.imageUrl
                )}
                alt={
                  selectedPlace.name
                }
                onError={
                  handleImageError
                }
              />

            </div>

            <div className="lightbox-content">

              <span>
                {
                  selectedPlace.category
                }
              </span>

              <h2>
                {selectedPlace.name}
              </h2>

              <p>
                {
                  selectedPlace.description
                }
              </p>

              <div className="lightbox-info">

                <div>
                  <small>
                    District
                  </small>

                  <strong>
                    {
                      selectedPlace.district
                    }
                  </strong>
                </div>

                {selectedPlace.verifiedDate && (
                  <div>
                    <small>
                      Verified
                    </small>

                    <strong>
                      {
                        selectedPlace.verifiedDate
                      }
                    </strong>
                  </div>
                )}

              </div>

              {selectedPlace.sourceUrl && (
                <a
                  href={
                    selectedPlace.sourceUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="lightbox-source"
                >
                  View Official Source ↗
                </a>
              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}