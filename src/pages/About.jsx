import "./About.css";

function About() {
  return (
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero">
        <span className="about-eyebrow">
          ABOUT CG DATA
        </span>

        <h1>Discover Chhattisgarh</h1>

        <p>
          CG DATA is an information platform created to explore
          the districts, agriculture, tourism, food and culture
          of Chhattisgarh in one place.
        </p>
      </section>

      {/* PROJECT INFO */}
      <section className="about-content">

        <div className="about-card">
          <span className="about-card-number">01</span>

          <h2>About the Project</h2>

          <p>
            CG DATA provides structured information about all
            33 districts of Chhattisgarh. The platform combines
            district information with an interactive map and
            category-based information.
          </p>
        </div>

        <div className="about-card">
          <span className="about-card-number">02</span>

          <h2>What You Can Explore</h2>

          <ul>
            <li>📍 33 Chhattisgarh Districts</li>
            <li>🗺️ Interactive District Map</li>
            <li>🌾 Agriculture Information</li>
            <li>🏞️ Tourism & Places</li>
            <li>🍲 Food & Culture</li>
            <li>🏛️ District Administration</li>
            <li>📋 Tehsil / Sub-District Information</li>
          </ul>
        </div>

        <div className="about-card">
          <span className="about-card-number">03</span>

          <h2>Data & Sources</h2>

          <p>
            District and administrative information is collected
            from official government sources and verified data
            sources. The backend stores the information in
            MongoDB and provides it through APIs.
          </p>

          <p className="about-source-note">
            Data is updated and verified as official information
            changes.
          </p>
        </div>

      </section>

      {/* TECHNOLOGY */}
      <section className="about-tech">

        <span className="about-eyebrow">
          TECHNOLOGY
        </span>

        <h2>Built With</h2>

        <div className="tech-grid">
          <div>⚛️ React</div>
          <div>🟢 Node.js</div>
          <div>🚀 Express.js</div>
          <div>🍃 MongoDB</div>
          <div>🗺️ GeoJSON</div>
          <div>🔗 REST API</div>
        </div>

      </section>

      {/* FOOTER MESSAGE */}
      <section className="about-footer">
        <h2>सही जानकारी, सही समय पर</h2>

        <p>
          Exploring Chhattisgarh through data, places,
          agriculture, food and culture.
        </p>
      </section>

    </div>
  );
}

export default About;