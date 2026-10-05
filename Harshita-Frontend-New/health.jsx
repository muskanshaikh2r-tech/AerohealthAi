import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");

  const [formData, setFormData] = useState({
    age: "",
    health: "Normal",
    travel: "Walking",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HOME PAGE
  const Home = () => (
    <>
      <section className="hero" id="home">
        <div className="hero-text">
          <div className="tag">
            ✨ AI-Powered Personal Air Intelligence
          </div>

          <h1>
            Breathe Smarter.
            <br />
            <span>Travel Safer.</span>
          </h1>

          <p>
            AeroHealth AI combines real-time air quality, weather and
            your health profile to help you understand your exposure
            and choose cleaner routes.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => setPage("health")}
            >
              Check My Health Risk →
            </button>

            <button
              className="secondary-btn"
              onClick={() => alert("Route Planner coming next!")}
            >
              🗺️ Find a Clean Route
            </button>
          </div>
        </div>

        <div className="aqi-card">
          <div className="card-top">
            <span>LIVE AIR QUALITY</span>
            <span className="live">● LIVE</span>
          </div>

          <div className="aqi-number">86</div>
          <div className="aqi-status">Moderate</div>

          <div className="aqi-location">
            📍 Pune, Maharashtra
          </div>

          <div className="pollution-details">
            <div>
              <small>PM2.5</small>
              <strong>34 µg/m³</strong>
            </div>

            <div>
              <small>PM10</small>
              <strong>58 µg/m³</strong>
            </div>

            <div>
              <small>Humidity</small>
              <strong>62%</strong>
            </div>
          </div>

          <div className="aqi-bar">
            <div></div>
          </div>

          <p className="updated">
            Updated a few moments ago
          </p>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <p>WHAT AEROHEALTH AI DOES</p>
          <h2>
            Your health. Your environment. One intelligent platform.
          </h2>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon blue">❤️</div>
            <h3>Personal Health Risk</h3>
            <p>
              Understand how current pollution may affect you based
              on your age, health condition and travel mode.
            </p>

            <button
              className="feature-link"
              onClick={() => setPage("health")}
            >
              Calculate Risk →
            </button>
          </div>

          <div className="feature-card highlight">
            <div className="feature-icon green">🌿</div>
            <h3>Clean-Air Route</h3>
            <p>
              Compare routes and discover a lower-pollution option
              instead of simply choosing the shortest route.
            </p>

            <button
              className="feature-link"
              onClick={() => alert("Route Planner coming next!")}
            >
              Plan a Route →
            </button>
          </div>

          <div className="feature-card">
            <div className="feature-icon orange">🗺️</div>
            <h3>Live Pollution Map</h3>
            <p>
              Explore pollution levels across different areas using
              an interactive live map.
            </p>

            <button
              className="feature-link"
              onClick={() => alert("Live Map coming next!")}
            >
              Explore Map →
            </button>
          </div>

          <div className="feature-card">
            <div className="feature-icon purple">🤧</div>
            <h3>Symptom Checker</h3>
            <p>
              Record symptoms and compare them with environmental
              conditions to identify possible triggers.
            </p>

            <button
              className="feature-link"
              onClick={() => alert("Symptom Checker coming next!")}
            >
              Check Symptoms →
            </button>
          </div>

        </div>
      </section>

      <section className="dashboard-preview">
        <div>
          <p className="mini-title">TODAY'S ENVIRONMENT</p>

          <h2>Know your air before you step outside.</h2>

          <p className="dashboard-text">
            Get a quick overview of the environmental conditions
            around you and make informed travel decisions.
          </p>
        </div>

        <div className="mini-cards">

          <div className="mini-card">
            <span>🌡️</span>
            <div>
              <small>Temperature</small>
              <strong>27°C</strong>
            </div>
          </div>

          <div className="mini-card">
            <span>💨</span>
            <div>
              <small>Wind Speed</small>
              <strong>12 km/h</strong>
            </div>
          </div>

          <div className="mini-card">
            <span>☁️</span>
            <div>
              <small>Weather</small>
              <strong>Partly Cloudy</strong>
            </div>
          </div>

        </div>
      </section>
    </>
  );


  // HEALTH PROFILE PAGE
  const HealthProfile = () => (
    <section className="health-page">

      <button
        className="back-btn"
        onClick={() => setPage("home")}
      >
        ← Back to Home
      </button>

      <div className="health-container">

        <div className="health-intro">
          <div className="health-icon">❤️</div>

          <p className="mini-title">
            PERSONAL HEALTH PROFILE
          </p>

          <h1>
            Tell us about yourself
          </h1>

          <p>
            Your information helps AeroHealth AI estimate your
            environmental exposure based on your personal profile.
          </p>
        </div>


        <div className="health-form">

          <div className="form-group">
            <label>Age</label>

            <input
              type="number"
              name="age"
              placeholder="Enter your age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="120"
            />
          </div>


          <div className="form-group">
            <label>Health Condition</label>

            <select
              name="health"
              value={formData.health}
              onChange={handleChange}
            >
              <option value="Normal">Normal</option>
              <option value="Asthma">Asthma</option>
              <option value="Allergy">Allergy</option>
              <option value="Other">Other</option>
            </select>
          </div>


          <div className="form-group">
            <label>Travel Mode</label>

            <select
              name="travel"
              value={formData.travel}
              onChange={handleChange}
            >
              <option value="Walking">Walking</option>
              <option value="Cycling">Cycling</option>
              <option value="Two-wheeler">Two-wheeler</option>
              <option value="Car">Car</option>
              <option value="Public Transport">
                Public Transport
              </option>
            </select>
          </div>


          <button
            className="calculate-btn"
            onClick={() => {
              if (!formData.age) {
                alert("Please enter your age first.");
                return;
              }

              setPage("risk");
            }}
          >
            Calculate My Risk →
          </button>

        </div>

      </div>
    </section>
  );


  // TEMPORARY RISK PAGE
  const RiskPage = () => (
    <section className="health-page">

      <button
        className="back-btn"
        onClick={() => setPage("health")}
      >
        ← Edit Profile
      </button>

      <div className="risk-result">

        <div className="health-icon">📊</div>

        <p className="mini-title">
          PERSONAL EXPOSURE RESULT
        </p>

        <h1>Your profile is ready</h1>

        <div className="profile-summary">
          <div>
            <small>Age</small>
            <strong>{formData.age}</strong>
          </div>

          <div>
            <small>Health</small>
            <strong>{formData.health}</strong>
          </div>

          <div>
            <small>Travel</small>
            <strong>{formData.travel}</strong>
          </div>
        </div>

        <div className="score-placeholder">
          <span>--</span>
          <p>
            Waiting for the Risk Calculation Engine
          </p>
        </div>

        <p className="risk-note">
          Member 2's Python backend will provide the actual
          personalized risk score here.
        </p>

        <button
          className="secondary-btn"
          onClick={() => setPage("home")}
        >
          ← Return Home
        </button>

      </div>
    </section>
  );


  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">

        <div
          className="logo"
          onClick={() => setPage("home")}
          style={{ cursor: "pointer" }}
        >
          <span className="logo-icon">🌿</span>
          <span>
            AeroHealth <b>AI</b>
          </span>
        </div>

        <div className="nav-links">

          <button onClick={() => setPage("home")}>
            Home
          </button>

          <button onClick={() => setPage("health")}>
            Health Profile
          </button>

          <button onClick={() => setPage("risk")}>
            Risk Score
          </button>

          <button onClick={() => alert("Route Planner coming next!")}>
            Route Planner
          </button>

          <button onClick={() => alert("Live Map coming next!")}>
            Live Map
          </button>

          <button onClick={() => alert("Symptom Checker coming next!")}>
            Symptoms
          </button>

        </div>

        <button
          className="profile-btn"
          onClick={() => setPage("health")}
        >
          My Profile
        </button>

      </nav>


      {/* PAGE CONTENT */}

      {page === "home" && <Home />}

      {page === "health" && <HealthProfile />}

      {page === "risk" && <RiskPage />}


      {/* FOOTER */}

      <footer>

        <div className="logo">
          <span className="logo-icon">🌿</span>
          AeroHealth <b>AI</b>
        </div>

        <p>
          Personalized exposure intelligence for healthier journeys.
        </p>

        <span className="footer-copy">
          © 2026 AeroHealth AI
        </span>

      </footer>

    </div>
  );
}

export default App;