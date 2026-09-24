import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Tourism.css";

/* ================================================= */
/* ================= CONFIG ======================== */
/* ================================================= */

const TOURISM_BANNER = "/images/banner.png";

const API_URL =
  "https://cgdata-backend.onrender.com/api/districts";

const BACKEND_URL =
  "https://cgdata-backend.onrender.com";

/* ================================================= */
/* ================= IMAGE HELPER ================== */
/* ================================================= */

const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "/images/banner.png";
  }

  const value = String(imageUrl).trim();

  if (!value) {
    return "/images/banner.png";
  }

  /* External image */
  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  /*
    IMPORTANT:

    Frontend public/images path ko direct use karenge.

    Example:
    /images/tourism/Tandula.jpeg

    isko backend URL nahi banayenge.

    Isi wajah se tumhari local waterfall images
    properly show hongi.
  */
  if (value.startsWith("/images/")) {
    return value;
  }

  /* Relative backend path */
  if (value.startsWith("/")) {
    return `${BACKEND_URL}${value}`;
  }

  return `${BACKEND_URL}/${value}`;
};

/* ================================================= */
/* ================= TEXT HELPER ================== */
/* ================================================= */

const getArrayText = (value) => {
  if (Array.isArray(value)) {
    return value.length
      ? value.join(", ")
      : "Information not available";
  }

  return value || "Information not available";
};

/* ================================================= */
/* ============== CATEGORY NORMALIZER ============== */
/* ================================================= */

const normalizeCategory = (category = "") => {
  return String(category)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
};

/* ================================================= */
/* ============ CATEGORY FROM IMAGE ================= */
/* ================================================= */

/*
  Agar database me category nahi hai,
  to image filename/path se category identify karenge.

  Example:

  waterfall.jpg
  tirathgarh_waterfall.jpg
  amritdhara.jpg
  ghatarani.jpg

  => Waterfall

  forest/uditi.jpg
  forest/kanan.jpg

  => Forest

  Forest images ko Wildlife filter me bhi show karenge.
*/

const detectImageCategory = (
  imageUrl = "",
  existingCategory = ""
) => {
  const category =
    String(existingCategory || "").trim();

  if (category) {
    return category;
  }

  const value =
    String(imageUrl || "").toLowerCase();

  if (
    value.includes("waterfall") ||
    value.includes("amritdhara") ||
    value.includes("ghatarani") ||
    value.includes("ranidhara") ||
    value.includes("tirathgarh")
  ) {
    return "Waterfall";
  }

  if (
    value.includes("/forest/") ||
    value.includes("forest")
  ) {
    return "Forest";
  }

  if (
    value.includes("wildlife") ||
    value.includes("sanctuary") ||
    value.includes("nationalpark")
  ) {
    return "Wildlife";
  }

  if (
    value.includes("temple") ||
    value.includes("mandir") ||
    value.includes("dham")
  ) {
    return "Temple";
  }

  if (
    value.includes("culture") ||
    value.includes("festival") ||
    value.includes("dance")
  ) {
    return "Culture";
  }

  return "Scenic";
};

/* ================================================= */
/* ============== TOURISM GALLERY ================= */
/* ================================================= */

/*
  Priority:

  1. tourismGallery
  2. imageGallery
  3. imageUrl
*/

const getTourismGallery = (district) => {
  /* --------------------------------------------- */
  /* 1. Preferred tourismGallery                    */
  /* --------------------------------------------- */

  if (
    Array.isArray(
      district?.tourismGallery
    ) &&
    district.tourismGallery.length > 0
  ) {
    return district.tourismGallery.map(
      (item, index) => ({
        ...item,

        id:
          item?.id ||
          item?._id ||
          `${district.districtName}-tourism-${index}`,

        name:
          item?.name ||
          "Tourist Place",

        category:
          detectImageCategory(
            item?.imageUrl,
            item?.category
          ),

        imageUrl:
          item?.imageUrl ||
          "",

        sourceUrl:
          item?.sourceUrl ||
          district?.sourceUrl ||
          "",
      })
    );
  }

  /* --------------------------------------------- */
  /* 2. Existing imageGallery fallback              */
  /* --------------------------------------------- */

  if (
    Array.isArray(
      district?.imageGallery
    ) &&
    district.imageGallery.length > 0
  ) {
    return district.imageGallery.map(
      (image, index) => {
        const imageUrl =
          typeof image === "string"
            ? image
            : image?.imageUrl || "";

        return {
          id:
            `${district.districtName}-gallery-${index}`,

          name:
            typeof image === "object" &&
            image?.name
              ? image.name
              : `${district.districtName} Tourism`,

          category:
            detectImageCategory(
              imageUrl,
              typeof image === "object"
                ? image?.category
                : ""
            ),

          imageUrl,

          sourceUrl:
            typeof image === "object" &&
            image?.sourceUrl
              ? image.sourceUrl
              : district?.sourceUrl || "",
        };
      }
    );
  }

  /* --------------------------------------------- */
  /* 3. imageUrl fallback                           */
  /* --------------------------------------------- */

  if (district?.imageUrl) {
    return [
      {
        id:
          `${district.districtName}-main`,

        name:
          `${district.districtName} Tourism`,

        category:
          detectImageCategory(
            district.imageUrl
          ),

        imageUrl:
          district.imageUrl,

        sourceUrl:
          district?.sourceUrl || "",
      },
    ];
  }

  return [];
};

/* ================================================= */
/* ================= CATEGORY DATA ================= */
/* ================================================= */

/*
  HERITAGE REMOVED
*/

const CATEGORY_LIST = [
  {
    key: "All",
    label: "All",
    icon: "🌿",
  },

  {
    key: "Waterfall",
    label: "Waterfalls",
    icon: "🌊",
  },

  {
    key: "Temple",
    label: "Temples",
    icon: "🛕",
  },

  {
    key: "Forest",
    label: "Forests",
    icon: "🌳",
  },

  {
    key: "Wildlife",
    label: "Wildlife",
    icon: "🐅",
  },

  {
    key: "Culture",
    label: "Culture",
    icon: "🎭",
  },
];

/* ================================================= */
/* ============== CULTURE INFORMATION ============== */
/* ================================================= */

const CULTURE_INFORMATION = [
  {
    title: "Language",
    icon: "🗣️",

    content:
      "Chhattisgarhi is widely spoken in Chhattisgarh along with local tribal languages and dialects.",

    source:
      "https://rajnandgaon.nic.in/en/culture-heritage/",
  },

  {
    title: "Tribal Culture",
    icon: "🌿",

    content:
      "Chhattisgarh has a rich tribal cultural tradition reflected in folk music, dance, customs, festivals, food, costumes and traditional arts.",

    source:
      "https://chhattisgarh.mygov.in/en/group/department-culture",
  },

  {
    title: "Folk Dances & Music",
    icon: "🎭",

    content:
      "Pandwani, Raut Nacha, Panthi and Suwa are important traditional folk performance forms of Chhattisgarh.",

    source:
      "https://durg.gov.in/en/culture-heritage/",
  },

  {
    title: "Key Festivals",
    icon: "🎉",

    content:
      "Hareli and Pola are important agricultural festivals. Chhattisgarh also hosts cultural events such as Rajim Kumbh and Bastar Lokotsav.",

    source:
      "https://chhattisgarh.mygov.in/en/group/department-culture",
  },
];

/* ================================================= */
/* ================= TOURISM ======================= */
/* ================================================= */

function Tourism() {
  const [districts, setDistricts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchText, setSearchText] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  /* ================================================= */
  /* ================= FETCH DATA ==================== */
  /* ================================================= */

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "Fetching tourism data:",
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

        if (!Array.isArray(data)) {
          throw new Error(
            "District API did not return an array"
          );
        }

        const sortedData =
          [...data].sort((a, b) =>
            String(
              a?.districtName || ""
            ).localeCompare(
              String(
                b?.districtName || ""
              )
            )
          );

        console.log(
          "Tourism districts:",
          sortedData
        );

        setDistricts(sortedData);
      } catch (err) {
        console.error(
          "Tourism data error:",
          err
        );

        setError(
          "Tourism data load nahi ho pa raha hai."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  /* ================================================= */
  /* ============== ALL TOURISM IMAGES =============== */
  /* ================================================= */

  const allTourismImages = useMemo(() => {
    return districts.flatMap(
      (district) =>
        getTourismGallery(
          district
        )
    );
  }, [districts]);

  const totalImages =
    allTourismImages.length;

  /* ================================================= */
  /* ================= SEARCH ======================== */
  /* ================================================= */

  const filteredDistricts =
    useMemo(() => {
      const search =
        searchText
          .trim()
          .toLowerCase();

      return districts.filter(
        (district) => {
          const districtName =
            String(
              district?.districtName ||
                ""
            ).toLowerCase();

          return districtName.includes(
            search
          );
        }
      );
    }, [
      districts,
      searchText,
    ]);

  /* ================================================= */
  /* ============ CATEGORY MATCH ==================== */
  /* ================================================= */

  const categoryMatches = (
    item,
    selectedCategory
  ) => {
    if (
      selectedCategory ===
      "All"
    ) {
      return true;
    }

    const itemCategory =
      normalizeCategory(
        item?.category
      );

    const selected =
      normalizeCategory(
        selectedCategory
      );

    /* --------------------------------------------- */
    /* Forest images are also used for Wildlife      */
    /* --------------------------------------------- */

    if (
      selected === "wildlife" &&
      itemCategory === "forest"
    ) {
      return true;
    }

    return (
      itemCategory === selected ||
      itemCategory.includes(selected) ||
      selected.includes(itemCategory)
    );
  };

  /* ================================================= */
  /* ============ FILTERED GALLERY ================== */
  /* ================================================= */

  const getFilteredGallery = (
    district
  ) => {
    const gallery =
      getTourismGallery(
        district
      );

    if (
      selectedCategory ===
      "All"
    ) {
      return gallery;
    }

    return gallery.filter(
      (item) =>
        categoryMatches(
          item,
          selectedCategory
        )
    );
  };

  /* ================================================= */
  /* ============== CATEGORY COUNTS ================= */
  /* ================================================= */

  const getCategoryCount = (
    category
  ) => {
    if (
      category ===
      "All"
    ) {
      return totalImages;
    }

    return allTourismImages.filter(
      (item) =>
        categoryMatches(
          item,
          category
        )
    ).length;
  };

  /* ================================================= */
  /* ================= LIGHTBOX ===================== */
  /* ================================================= */

  const openImage = (
    image,
    districtName,
    gallery,
    index
  ) => {
    setSelectedImage({
      image,
      districtName,
      gallery,
      index,
    });
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (!selectedImage) {
      return;
    }

    const gallery =
      selectedImage.gallery;

    if (!gallery.length) {
      return;
    }

    const nextIndex =
      (
        selectedImage.index +
        1
      ) % gallery.length;

    setSelectedImage({
      ...selectedImage,

      image:
        gallery[nextIndex],

      index:
        nextIndex,
    });
  };

  const previousImage = () => {
    if (!selectedImage) {
      return;
    }

    const gallery =
      selectedImage.gallery;

    if (!gallery.length) {
      return;
    }

    const previousIndex =
      (
        selectedImage.index -
        1 +
        gallery.length
      ) % gallery.length;

    setSelectedImage({
      ...selectedImage,

      image:
        gallery[
          previousIndex
        ],

      index:
        previousIndex,
    });
  };

  /* ================================================= */
  /* ================= LOADING ======================= */
  /* ================================================= */

  if (loading) {
    return (
      <div className="tourism-page">

        <div className="tourism-loading">

          <div className="tourism-loader-icon">
            🏞️
          </div>

          <h2>
            Loading Chhattisgarh Tourism...
          </h2>

          <p>
            Discovering beautiful places
            across Chhattisgarh.
          </p>

        </div>

      </div>
    );
  }

  /* ================================================= */
  /* ================= ERROR ========================= */
  /* ================================================= */

  if (error) {
    return (
      <div className="tourism-page">

        <div className="tourism-error">

          <div>
            ⚠️
          </div>

          <h2>
            Tourism data unavailable
          </h2>

          <p>
            {error}
          </p>

          <p>
            Please make sure the backend
            server is running on port 5000.
          </p>

        </div>

      </div>
    );
  }

  /* ================================================= */
  /* ================= MAIN UI ======================= */
  /* ================================================= */

  return (
    <div className="tourism-page">

      {/* ================================================= */}
      {/* ================= HERO ========================== */}
      {/* ================================================= */}

      <section
        className="tourism-hero"
        style={{
          backgroundImage:
            `url(${TOURISM_BANNER})`,
        }}
      >

        <div className="tourism-hero-overlay">

          <div className="tourism-hero-content">

            <span className="tourism-label">
              EXPLORE · EXPERIENCE · DISCOVER
            </span>

            <h1>
              HUMAR CHHATTISGARH
            </h1>

            <h2>
              Explore the Heart of Chhattisgarh
            </h2>

            <p>
              Waterfalls · Temples · Forests
              · Wildlife · Culture
            </p>

            <div className="tourism-hero-badge">
              🌿 {districts.length} Districts
              {" · "}
              📷 {totalImages} Images
            </div>

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* ================= INTRO ========================= */}
      {/* ================================================= */}

      <section className="tourism-intro">

        <span>
          CHHATTISGARH TOURISM
        </span>

        <h2>
          Discover the Beauty of Chhattisgarh
        </h2>

        <p>
          Explore waterfalls, temples,
          forests, wildlife and cultural
          destinations across the districts
          of Chhattisgarh.
        </p>

      </section>

      {/* ================================================= */}
      {/* ================ CATEGORY FILTER ================ */}
      {/* ================================================= */}

      <section className="tourism-category-section">

        {CATEGORY_LIST.map(
          (category) => {

            const count =
              getCategoryCount(
                category.key
              );

            return (
              <button
                key={
                  category.key
                }
                type="button"
                className={
                  selectedCategory ===
                  category.key
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setSelectedCategory(
                    category.key
                  )
                }
              >

                <span>
                  {category.icon}
                </span>

                <span>
                  {category.label}
                </span>

                <small>
                  {count}
                </small>

              </button>
            );
          }
        )}

      </section>

      {/* ================================================= */}
      {/* ================= SEARCH ======================== */}
      {/* ================================================= */}

      <section className="tourism-search-section">

        <div className="tourism-search">

          <span>
            🔎
          </span>

          <input
            type="text"
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value
              )
            }
            placeholder="Search district..."
          />

          {searchText && (
            <button
              type="button"
              onClick={() =>
                setSearchText("")
              }
            >
              ✕
            </button>
          )}

        </div>

        <div className="tourism-count">

          Showing{" "}

          <strong>
            {filteredDistricts.length}
          </strong>

          {" "}of{" "}

          <strong>
            {districts.length}
          </strong>

          {" "}districts

        </div>

      </section>

      {/* ================================================= */}
      {/* ============== DISTRICT TOURISM ================= */}
      {/* ================================================= */}

      <section className="tourism-districts">

        <div className="tourism-grid">

          {filteredDistricts.map(
            (district) => {

              const gallery =
                getFilteredGallery(
                  district
                );

              return (
                <article
                  className="tourism-card"
                  key={
                    district._id ||
                    district.districtName
                  }
                >

                  {/* ======================================= */}
                  {/* DISTRICT HEADING                         */}
                  {/* ======================================= */}

                  <div className="tourism-card-heading">

                    <div>

                      <span>
                        DISTRICT
                      </span>

                      <h3>
                        {
                          district.districtName
                        }
                      </h3>

                    </div>

                    <div className="tourism-photo-count">

                      📷{" "}
                      {gallery.length}

                    </div>

                  </div>

                  {/* ======================================= */}
                  {/* GALLERY                                  */}
                  {/* ======================================= */}

                  {gallery.length > 0 ? (

                    <div className="tourism-gallery">

                      {gallery.map(
                        (
                          item,
                          index
                        ) => {

                          const imageUrl =
                            getImageUrl(
                              item?.imageUrl
                            );

                          return (
                            <button
                              type="button"
                              className={
                                index === 0
                                  ? "tourism-gallery-item featured"
                                  : "tourism-gallery-item"
                              }
                              key={
                                item.id ||
                                `${district.districtName}-${index}`
                              }
                              onClick={() =>
                                openImage(
                                  item,
                                  district.districtName,
                                  gallery,
                                  index
                                )
                              }
                            >

                              <img
                                src={
                                  imageUrl
                                }
                                alt={
                                  item?.name ||
                                  `${district.districtName} tourism`
                                }
                                loading="lazy"
                                onError={(
                                  event
                                ) => {

                                  if (
                                    event
                                      .currentTarget
                                      .dataset
                                      .fallback
                                  ) {
                                    return;
                                  }

                                  event
                                    .currentTarget
                                    .dataset
                                    .fallback =
                                    "true";

                                  event
                                    .currentTarget
                                    .src =
                                    "/images/banner.png";
                                }}
                              />

                              <div className="tourism-gallery-overlay">

                                <span>
                                  🔍
                                </span>

                                <div>

                                  <strong>
                                    {
                                      item?.name ||
                                      "Tourist Place"
                                    }
                                  </strong>

                                  {item?.category && (
                                    <small>
                                      {
                                        item.category
                                      }
                                    </small>
                                  )}

                                </div>

                              </div>

                            </button>
                          );
                        }
                      )}

                    </div>

                  ) : (

                    <div className="tourism-no-photo">

                      <span>
                        🏞️
                      </span>

                      <h4>
                        No images available
                      </h4>

                      <p>
                        {selectedCategory !==
                        "All"
                          ? `No ${selectedCategory.toLowerCase()} images available for this district.`
                          : "Tourism photos will be added soon."}
                      </p>

                    </div>

                  )}

                  {/* ======================================= */}
                  {/* INFORMATION                              */}
                  {/* ======================================= */}

                  <div className="tourism-card-content">

                    {district.naturalPlaces && (
                      <div className="tourism-item">

                        <div className="tourism-icon">
                          🌿
                        </div>

                        <div>

                          <h4>
                            Natural Places
                          </h4>

                          <p>
                            {getArrayText(
                              district.naturalPlaces
                            )}
                          </p>

                        </div>

                      </div>
                    )}

                    {district.religiousPlaces && (
                      <div className="tourism-item">

                        <div className="tourism-icon">
                          🛕
                        </div>

                        <div>

                          <h4>
                            Religious Places
                          </h4>

                          <p>
                            {getArrayText(
                              district.religiousPlaces
                            )}
                          </p>

                        </div>

                      </div>
                    )}

                    {district.touristPlaces && (
                      <div className="tourism-item">

                        <div className="tourism-icon">
                          📍
                        </div>

                        <div>

                          <h4>
                            Tourist Places
                          </h4>

                          <p>
                            {getArrayText(
                              district.touristPlaces
                            )}
                          </p>

                        </div>

                      </div>
                    )}

                    {district.wildlifeNationalParks && (
                      <div className="tourism-item">

                        <div className="tourism-icon">
                          🐅
                        </div>

                        <div>

                          <h4>
                            Wildlife & Parks
                          </h4>

                          <p>
                            {getArrayText(
                              district.wildlifeNationalParks
                            )}
                          </p>

                        </div>

                      </div>
                    )}

                    {district.festivalsCulture && (
                      <div className="tourism-item">

                        <div className="tourism-icon">
                          🎭
                        </div>

                        <div>

                          <h4>
                            Culture & Festivals
                          </h4>

                          <p>
                            {getArrayText(
                              district.festivalsCulture
                            )}
                          </p>

                        </div>

                      </div>
                    )}

                    {/* =================================== */}
                    {/* EXPLORE BUTTON                        */}
                    {/* =================================== */}

                    <Link
                      to={`/district/${encodeURIComponent(
                        district.districtName
                      )}`}
                      className="tourism-details-btn"
                    >

                      Explore District

                      <span>
                        →
                      </span>

                    </Link>

                  </div>

                </article>
              );
            }
          )}

        </div>

        {/* ================================================= */}
        {/* NO SEARCH RESULT                                  */}
        {/* ================================================= */}

        {filteredDistricts.length ===
          0 && (

          <div className="tourism-no-results">

            <div>
              🔎
            </div>

            <h3>
              No district found
            </h3>

            <p>
              Try another district name.
            </p>

            <button
              type="button"
              onClick={() =>
                setSearchText("")
              }
            >
              Show All Districts
            </button>

          </div>

        )}

      </section>

      {/* ================================================= */}
      {/* ================= CULTURE ======================= */}
      {/* ================================================= */}

      <section className="tourism-culture-section">

        <div className="tourism-culture-heading">

          <span>
            CULTURE OF CHHATTISGARH
          </span>

          <h2>
            Culture, People & Traditions
          </h2>

          <p>
            Explore the language, folk traditions,
            dances, music and festivals that form
            an important part of Chhattisgarh's
            cultural life.
          </p>

        </div>

        <div className="tourism-culture-grid">

          {CULTURE_INFORMATION.map(
            (item) => (

              <article
                className="tourism-culture-card"
                key={
                  item.title
                }
              >

                <div className="tourism-culture-icon">
                  {item.icon}
                </div>

                <span className="tourism-culture-label">
                  CULTURE
                </span>

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.content}
                </p>

                <a
                  href={
                    item.source
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Official Source ↗
                </a>

              </article>

            )
          )}

        </div>

      </section>

      {/* ================================================= */}
      {/* ================= HIGHLIGHTS ==================== */}
      {/* ================================================= */}

      <section className="tourism-highlights">

        <div className="tourism-highlight">

          <span>
            🌊
          </span>

          <h3>
            Waterfalls
          </h3>

          <p>
            Natural waterfalls and scenic
            destinations.
          </p>

        </div>

        <div className="tourism-highlight">

          <span>
            🛕
          </span>

          <h3>
            Temples
          </h3>

          <p>
            Religious places and
            spiritual destinations.
          </p>

        </div>

        <div className="tourism-highlight">

          <span>
            🌳
          </span>

          <h3>
            Forests
          </h3>

          <p>
            Dense forests and natural
            landscapes.
          </p>

        </div>

        <div className="tourism-highlight">

          <span>
            🐅
          </span>

          <h3>
            Wildlife
          </h3>

          <p>
            Wildlife areas and protected
            natural landscapes.
          </p>

        </div>

      </section>

      {/* ================================================= */}
      {/* ================= BOTTOM ======================== */}
      {/* ================================================= */}

      <section className="tourism-bottom">

        <div className="tourism-bottom-content">

          <span>
            TRAVEL · NATURE · CULTURE
          </span>

          <h2>
            HUMAR CHHATTISGARH
          </h2>

          <p>
            Explore the natural beauty,
            spirituality, wildlife and
            cultural life of Chhattisgarh.
          </p>

          <Link
            to="/districts"
            className="tourism-bottom-btn"
          >
            Explore All Districts →
          </Link>

        </div>

      </section>

      {/* ================================================= */}
      {/* ================= LIGHTBOX ====================== */}
      {/* ================================================= */}

      {selectedImage && (

        <div
          className="tourism-lightbox"
          onClick={
            closeImage
          }
        >

          {/* CLOSE */}

          <button
            type="button"
            className="tourism-lightbox-close"
            onClick={
              closeImage
            }
          >
            ✕
          </button>

          {/* PREVIOUS */}

          <button
            type="button"
            className="tourism-lightbox-prev"
            onClick={(
              event
            ) => {

              event.stopPropagation();

              previousImage();
            }}
          >
            ‹
          </button>

          {/* CONTENT */}

          <div
            className="tourism-lightbox-content"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            <img
              src={getImageUrl(
                selectedImage
                  .image
                  ?.imageUrl
              )}
              alt={
                selectedImage
                  .image
                  ?.name ||
                selectedImage
                  .districtName
              }
              onError={(
                event
              ) => {

                if (
                  event.currentTarget
                    .dataset
                    .fallback
                ) {
                  return;
                }

                event.currentTarget
                  .dataset
                  .fallback =
                  "true";

                event.currentTarget.src =
                  "/images/banner.png";
              }}
            />

            <div className="tourism-lightbox-info">

              <span>
                {
                  selectedImage
                    .image
                    ?.category ||
                  "Tourism"
                }
              </span>

              <h3>
                {
                  selectedImage
                    .image
                    ?.name ||
                  selectedImage
                    .districtName
                }
              </h3>

              <p>
                {
                  selectedImage
                    .districtName
                }
              </p>

              {
                selectedImage
                  .image
                  ?.sourceUrl && (

                  <a
                    href={
                      selectedImage
                        .image
                        .sourceUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    onClick={(
                      event
                    ) =>
                      event.stopPropagation()
                    }
                  >
                    View Source ↗
                  </a>
                )
              }

            </div>

          </div>

          {/* NEXT */}

          <button
            type="button"
            className="tourism-lightbox-next"
            onClick={(
              event
            ) => {

              event.stopPropagation();

              nextImage();
            }}
          >
            ›
          </button>

        </div>

      )}

    </div>
  );
}

export default Tourism;