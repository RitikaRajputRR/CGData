
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Agriculture.css";

const API_URL = "http://192.168.1.198:5000/api/districts";

function Agriculture() {
  const [districts, setDistricts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch district data");
        }

        const data = await response.json();

        setDistricts(data);
      } catch (error) {
        console.error("Agriculture data error:", error);
        setError("Unable to load agriculture data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  const filteredDistricts = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) {
      return districts;
    }

    return districts.filter((district) =>
      district.districtName?.toLowerCase().includes(search)
    );
  }, [districts, searchText]);

  const handleViewDetails = (districtName) => {
    navigate(`/district/${encodeURIComponent(districtName)}`);
  };

  const totalDistricts = districts.length;

  const districtsWithAgriculture = districts.filter(
    (district) =>
      district.agricultureMajorCrops &&
      district.agricultureMajorCrops.trim() !== ""
  ).length;

  if (loading) {
    return (
      <div className="agriculture-page">
        <div className="agriculture-loading">
          Loading agriculture data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="agriculture-page">
        <div className="agriculture-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="agriculture-page">

      {/* HERO */}
      <section className="agriculture-hero">

        <span className="agriculture-eyebrow">
          🌾 CHHATTISGARH AGRICULTURE
        </span>

        <h1>
          Agriculture of Chhattisgarh
        </h1>

        <p>
          Explore agriculture, major crops and farming information
          across the districts of Chhattisgarh.
        </p>

        <div className="agriculture-stats">

          <div className="agriculture-stat-card">
            <strong>{totalDistricts}</strong>
            <span>Districts</span>
          </div>

          <div className="agriculture-stat-card">
            <strong>{districtsWithAgriculture}</strong>
            <span>Districts with Data</span>
          </div>

          <div className="agriculture-stat-card">
            <strong>🌾</strong>
            <span>Major Crops</span>
          </div>

        </div>
      </section>

      {/* CROP OVERVIEW */}
      <section className="crop-overview">

        <div className="section-heading">
          <span>AGRICULTURAL PROFILE</span>
          <h2>Major Agricultural Crops</h2>
          <p>
            Agriculture is an important part of Chhattisgarh's
            economy and rural life.
          </p>
        </div>

        <div className="crop-cards">

          <div className="crop-card">
            <div className="crop-icon">🌾</div>
            <h3>Rice</h3>
            <p>
              Paddy is one of the major agricultural crops
              cultivated across Chhattisgarh.
            </p>
          </div>

          <div className="crop-card">
            <div className="crop-icon">🌽</div>
            <h3>Maize</h3>
            <p>
              Maize is cultivated in several parts of the state
              and supports local agriculture.
            </p>
          </div>

          <div className="crop-card">
            <div className="crop-icon">🌱</div>
            <h3>Gram</h3>
            <p>
              Gram and other pulses are important crops in
              different agricultural regions.
            </p>
          </div>

          <div className="crop-card">
            <div className="crop-icon">🌿</div>
            <h3>Pulses</h3>
            <p>
              Pulses such as arhar and other varieties contribute
              to the state's crop diversity.
            </p>
          </div>

        </div>
      </section>

      {/* SEARCH */}
      <section className="agriculture-directory">

        <div className="agriculture-directory-header">
          <div>
            <span className="directory-eyebrow">
              DISTRICT-WISE DATA
            </span>

            <h2>
              Agriculture by District
            </h2>
          </div>

          <div className="agriculture-count">
            {filteredDistricts.length} Districts
          </div>
        </div>

        <div className="agriculture-search">

          <input
            type="text"
            placeholder="Search district..."
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
          />

          <span>🔍</span>

        </div>

        {/* DISTRICT CARDS */}
        <div className="agriculture-district-grid">

          {filteredDistricts.map((district) => (

            <article
              className="agriculture-district-card"
              key={district._id || district.districtName}
            >

              <div className="agriculture-card-top">

                <div className="agriculture-card-icon">
                  🌾
                </div>

                <div>
                  <span>District</span>

                  <h3>
                    {district.districtName}
                  </h3>
                </div>

              </div>

              <div className="agriculture-card-body">

                <span className="crop-label">
                  MAJOR AGRICULTURE / CROPS
                </span>

                <p>
                  {district.agricultureMajorCrops ||
                    "Agriculture information not available."}
                </p>

                {district.area && (
                  <div className="agriculture-mini-info">
                    <span>Area</span>
                    <strong>{district.area}</strong>
                  </div>
                )}

              </div>

              <button
                className="agriculture-details-btn"
                onClick={() =>
                  handleViewDetails(district.districtName)
                }
              >
                View District Details →
              </button>

            </article>

          ))}

        </div>

        {filteredDistricts.length === 0 && (
          <div className="agriculture-no-result">
            No district found.
          </div>
        )}

      </section>

      {/* FOOTER NOTE */}
      <section className="agriculture-note">

        <div className="agriculture-note-icon">
          🌱
        </div>

        <div>
          <h3>
            District-wise Agriculture Information
          </h3>

          <p>
            Agriculture information displayed on this page is
            connected with the district data available in the
            CG DATA database.
          </p>
        </div>

      </section>

    </div>
  );
}

export default Agriculture;

