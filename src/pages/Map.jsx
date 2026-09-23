import ChhattisgarhMap from "../components/ChhattisgarhMap";
import "./Map.css";

function Map() {
  return (
    <main className="map-page">
      {/* Page Header */}
      <section className="map-page-header">
        <span className="map-eyebrow">
          CHHATTISGARH MAP
        </span>

        <h1>Explore Chhattisgarh</h1>

        <p>
          Explore all 33 districts of Chhattisgarh through the
          interactive district map.
        </p>
      </section>

      {/* Interactive Map */}
      <section className="map-page-card">
        <div className="map-card-header">
          <div>
            <span className="map-card-label">
              INTERACTIVE MAP
            </span>

            <h2>Chhattisgarh District Map</h2>

            <p className="map-card-description">
              Click any district to view its detailed information.
            </p>
          </div>

          <div className="map-district-count">
            <strong>33</strong>
            <span>Districts</span>
          </div>
        </div>

        {/* Map */}
        <div className="map-container">
          <ChhattisgarhMap />
        </div>

        {/* Help */}
        <div className="map-help">
          <span className="map-help-icon">⌖</span>

          <div>
            <strong>Select a district</strong>

            <p>
              Click on any district on the map to explore its details.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Map;