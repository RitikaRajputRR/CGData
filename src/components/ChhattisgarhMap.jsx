import { useEffect, useMemo, useState } from "react";
import { geoIdentity, geoPath } from "d3-geo";
import { useNavigate } from "react-router-dom";
import "./ChhattisgarhMap.css";

/* =========================================================
   REAL CHHATTISGARH DISTRICT MAP API
========================================================= */

const MAP_URL =
  "https://livingatlas.esri.in/server/rest/services/IAB2024/India_Administrative_Boundaries_2024/MapServer/2/query";

/* =========================================================
   DISTRICT COLORS
========================================================= */

const districtColors = [
  "#F6C945",
  "#F28C28",
  "#69C85B",
  "#7894E8",
  "#F29DB8",
  "#54B8C5",
  "#E8A85C",
  "#9ACD68",
  "#C58BE8",
  "#F28E8E",
  "#D7A85C",
  "#78BFA5",
];

/* =========================================================
   NORMALIZE DISTRICT NAME
========================================================= */

function normalizeDistrictName(name) {
  if (!name) return "";

  return String(name)
    .toLowerCase()
    .replace(/district/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/* =========================================================
   DISTRICT ALIASES
========================================================= */

function getAppDistrictName(name) {
  if (!name) return "";

  const normalized = normalizeDistrictName(name);

  const aliases = {
    balrampur: "Balrampur-Ramanujganj",

    gariyaband: "Gariaband",
    gariaband: "Gariaband",

    korea: "Korea",
    koriya: "Korea",

    gaurelapendramarwahi:
      "Gaurela-Pendra-Marwahi",

    khairagarhchhuikhadangandai:
      "Khairagarh-Chhuikhadan-Gandai",

    manendragarhchirmiribharatpur:
      "Manendragarh-Chirmiri-Bharatpur",

    mohlamanpurambagarhchowki:
      "Mohla-Manpur-Ambagarh Chowki",

    sarangarhbilaigarh:
      "Sarangarh-Bilaigarh",

    balodabazarbhatapara:
      "Baloda Bazar-Bhatapara",

    janjgirchampa:
      "Janjgir-Champa",
  };

  return aliases[normalized] || name;
}

/* =========================================================
   GET DISTRICT NAME FROM ESRI FEATURE
========================================================= */

function getDistrictName(feature) {
  const properties = feature?.properties || {};

  const possibleNames = [
    properties.name,
    properties.NAME,
    properties.Name,
    properties.district,
    properties.DISTRICT,
    properties.District,
    properties.lgd_districtname,
    properties.LGD_DISTRICTNAME,
    properties.censusname,
    properties.CensusName,
  ];

  const foundName = possibleNames.find(
    (value) =>
      typeof value === "string" &&
      value.trim() !== ""
  );

  return foundName ? foundName.trim() : "Unknown";
}

/* =========================================================
   DISPLAY NAME
========================================================= */

function displayDistrictName(name) {
  const shortNames = {
    "Balrampur-Ramanujganj":
      "BALRAMPUR",

    "Gaurela-Pendra-Marwahi":
      "GPM",

    "Khairagarh-Chhuikhadan-Gandai":
      "KCG",

    "Manendragarh-Chirmiri-Bharatpur":
      "MCB",

    "Mohla-Manpur-Ambagarh Chowki":
      "MOHLA-MANPUR",

    "Sarangarh-Bilaigarh":
      "SARANGARH",

    "Baloda Bazar-Bhatapara":
      "BALODA BAZAR",

    "Janjgir-Champa":
      "JANJGIR\nCHAMPA",
  };

  return (
    shortNames[name] ||
    String(name).toUpperCase()
  );
}

/* =========================================================
   VALIDATE GEOJSON
========================================================= */

function validateGeoJSON(data) {
  if (!data) {
    return {
      valid: false,
      message: "Empty map response.",
    };
  }

  if (data.error) {
    return {
      valid: false,
      message:
        data.error.message ||
        "Esri map service returned an error.",
    };
  }

  if (data.type !== "FeatureCollection") {
    return {
      valid: false,
      message:
        `Expected GeoJSON FeatureCollection but received "${data.type || "unknown"}".`,
    };
  }

  if (!Array.isArray(data.features)) {
    return {
      valid: false,
      message: "GeoJSON features array is missing.",
    };
  }

  if (data.features.length === 0) {
    return {
      valid: false,
      message: "No district geometries were returned.",
    };
  }

  const validFeatures = data.features.filter(
    (feature) =>
      feature &&
      feature.type === "Feature" &&
      feature.geometry &&
      feature.geometry.coordinates
  );

  if (validFeatures.length === 0) {
    return {
      valid: false,
      message:
        "District geometries were returned but none are valid.",
    };
  }

  return {
    valid: true,
    data: {
      ...data,
      features: validFeatures,
    },
  };
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ChhattisgarhMap({
  selectedDistrict = "",
  onDistrictClick,
}) {
  const navigate = useNavigate();

  const [geoData, setGeoData] = useState(null);
  const [error, setError] = useState("");
  const [hoveredDistrict, setHoveredDistrict] =
    useState("");

  /* =======================================================
     LOAD REAL DISTRICT MAP
  ======================================================= */

  useEffect(() => {
    let isMounted = true;

    const loadMap = async () => {
      try {
        setError("");
        setGeoData(null);

        const params = new URLSearchParams({
          where: "state='Chhattisgarh'",

          outFields:
            "name,state,lgd_districtname,dist_locallang,lgd_districtcode",

          returnGeometry: "true",

          outSR: "3857",

          returnTrueCurves: "false",

          f: "geojson",
        });

        const requestUrl =
          `${MAP_URL}?${params.toString()}`;

        console.log(
          "Loading Chhattisgarh district map..."
        );

        console.log(
          "Map URL:",
          requestUrl
        );

        const response =
          await fetch(requestUrl);

        if (!response.ok) {
          throw new Error(
            `District map loading failed. HTTP ${response.status}`
          );
        }

        const data =
          await response.json();

        console.log(
          "Raw Esri map response:",
          data
        );

        const validation =
          validateGeoJSON(data);

        if (!validation.valid) {
          console.error(
            "Invalid Esri map response:",
            data
          );

          throw new Error(
            validation.message
          );
        }

        const cleanData =
          validation.data;

        const districtNames =
          cleanData.features.map(
            getDistrictName
          );

        console.log(
          "================================="
        );

        console.log(
          "CHHATTISGARH DISTRICT COUNT:",
          cleanData.features.length
        );

        console.log(
          "CHHATTISGARH DISTRICTS:",
          districtNames
        );

        console.log(
          "FIRST GEOMETRY:",
          cleanData.features[0]?.geometry
        );

        console.log(
          "================================="
        );

        if (cleanData.features.length < 33) {
          console.warn(
            `Expected at least 33 district geometries but received ${cleanData.features.length}.`
          );
        }

        if (isMounted) {
          setGeoData(cleanData);
        }
      } catch (mapError) {
        console.error(
          "Chhattisgarh map error:",
          mapError
        );

        if (isMounted) {
          setError(
            mapError?.message ||
              "Unable to load Chhattisgarh district map."
          );
        }
      }
    };

    loadMap();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =======================================================
     MAP PROJECTION
  ======================================================= */

  const projection = useMemo(() => {
    if (!geoData) return null;

    try {
      return geoIdentity()
        .reflectY(true)
        .fitSize(
          [620, 680],
          geoData
        );
    } catch (projectionError) {
      console.error(
        "Map projection error:",
        projectionError
      );

      return null;
    }
  }, [geoData]);

  /* =======================================================
     PATH GENERATOR
  ======================================================= */

  const pathGenerator = useMemo(() => {
    if (!projection) return null;

    return geoPath(projection);
  }, [projection]);

  /* =======================================================
     DISTRICT CLICK HANDLER
  ======================================================= */

  const handleDistrictClick = (districtName) => {
    if (
      !districtName ||
      districtName === "Unknown"
    ) {
      return;
    }

    console.log(
      "District clicked:",
      districtName
    );

    /*
      If parent component provides onDistrictClick,
      use that function.
    */

    if (
      typeof onDistrictClick === "function"
    ) {
      onDistrictClick(districtName);
      return;
    }

    /*
      Otherwise directly navigate to
      district details page.
    */

    navigate(
      `/district/${encodeURIComponent(
        districtName
      )}`
    );
  };

  /* =======================================================
     ERROR SCREEN
  ======================================================= */

  if (error) {
    return (
      <div className="map-error">
        <div className="map-error-icon">
          ⚠️
        </div>

        <h3>
          Map could not be loaded
        </h3>

        <p>{error}</p>

        <small>
          Open browser console for map API details.
        </small>
      </div>
    );
  }

  /* =======================================================
     LOADING SCREEN
  ======================================================= */

  if (!geoData || !pathGenerator) {
    return (
      <div className="map-loading">
        <div className="map-spinner"></div>

        <p>
          Loading 33 Chhattisgarh districts...
        </p>
      </div>
    );
  }

  /* =======================================================
     MAP
  ======================================================= */

  return (
    <div className="real-map-container">
      <svg
        className="chhattisgarh-svg"
        viewBox="0 0 620 680"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Interactive map of 33 districts of Chhattisgarh"
      >

        {/* =================================================
            DISTRICT SHAPES
        ================================================== */}

        <g className="district-shapes">
          {geoData.features.map(
            (feature, index) => {
              const rawName =
                getDistrictName(
                  feature
                );

              const districtName =
                getAppDistrictName(
                  rawName
                );

              const selected =
                normalizeDistrictName(
                  districtName
                ) ===
                normalizeDistrictName(
                  selectedDistrict
                );

              const hovered =
                normalizeDistrictName(
                  districtName
                ) ===
                normalizeDistrictName(
                  hoveredDistrict
                );

              const path =
                pathGenerator(
                  feature
                );

              if (!path) {
                console.warn(
                  "Unable to create map path:",
                  districtName
                );

                return null;
              }

              return (
                <path
                  key={`${districtName}-${index}`}

                  d={path}

                  className={`cg-district ${
                    selected
                      ? "selected"
                      : ""
                  } ${
                    hovered
                      ? "hovered"
                      : ""
                  }`}

                  style={{
                    "--district-color":
                      districtColors[
                        index %
                          districtColors.length
                      ],
                  }}

                  /*
                    MAIN CLICK FIX
                  */
                  onClick={() =>
                    handleDistrictClick(
                      districtName
                    )
                  }

                  onMouseEnter={() =>
                    setHoveredDistrict(
                      districtName
                    )
                  }

                  onMouseLeave={() =>
                    setHoveredDistrict("")
                  }

                  onFocus={() =>
                    setHoveredDistrict(
                      districtName
                    )
                  }

                  onBlur={() =>
                    setHoveredDistrict("")
                  }

                  onKeyDown={(event) => {
                    if (
                      event.key ===
                        "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();

                      handleDistrictClick(
                        districtName
                      );
                    }
                  }}

                  tabIndex={0}
                  role="button"
                >
                  <title>
                    {districtName}
                  </title>
                </path>
              );
            }
          )}
        </g>

        {/* =================================================
            DISTRICT LABELS
        ================================================== */}

        <g className="district-labels">
          {geoData.features.map(
            (feature, index) => {
              const rawName =
                getDistrictName(
                  feature
                );

              const districtName =
                getAppDistrictName(
                  rawName
                );

              const center =
                pathGenerator.centroid(
                  feature
                );

              if (
                !center ||
                !Number.isFinite(
                  center[0]
                ) ||
                !Number.isFinite(
                  center[1]
                )
              ) {
                return null;
              }

              const selected =
                normalizeDistrictName(
                  districtName
                ) ===
                normalizeDistrictName(
                  selectedDistrict
                );

              const label =
                displayDistrictName(
                  districtName
                );

              const lines =
                label.split("\n");

              return (
                <text
                  key={`label-${districtName}-${index}`}

                  x={center[0]}

                  y={center[1]}

                  className={`district-label ${
                    selected
                      ? "selected-label"
                      : ""
                  }`}

                  textAnchor="middle"

                  pointerEvents="none"
                >
                  {lines.map(
                    (
                      line,
                      lineIndex
                    ) => (
                      <tspan
                        key={`${districtName}-line-${lineIndex}`}

                        x={center[0]}

                        dy={
                          lineIndex === 0
                            ? lines.length > 1
                              ? "-5"
                              : "0"
                            : "11"
                        }
                      >
                        {line}
                      </tspan>
                    )
                  )}
                </text>
              );
            }
          )}
        </g>
      </svg>

      {/* =================================================
          TOOLTIP
      ================================================== */}

      {hoveredDistrict && (
        <div className="map-tooltip">
          <span>
            {hoveredDistrict}
          </span>

          <small>
            Click to view details
          </small>
        </div>
      )}
    </div>
  );
}