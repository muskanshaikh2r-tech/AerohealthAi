import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");

  const [formData, setFormData] = useState({
    age: "",
    health: "Normal",
    travel: "Walking",
  });

  const [routeData, setRouteData] = useState({
    from: "",
    to: "",
    travel: "Walking",
  });

  const [routeSearched, setRouteSearched] = useState(false);
  const [symptoms, setSymptoms] = useState([]);

  const navItems = [
    ["home", "Home"],
    ["health", "Health Profile"],
    ["risk", "Risk Score"],
    ["route", "Clean-Air Route"],
    ["symptoms", "Symptoms"],
  ];

  const goTo = (pageName) => {
    setPage(pageName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRouteChange = (e) => {
    setRouteData({
      ...routeData,
      [e.target.name]: e.target.value,
    });
  };

  const findCleanRoute = () => {
    if (!routeData.from || !routeData.to) {
      alert("Please enter both starting point and destination.");
      return;
    }

    setRouteSearched(true);
  };

  const symptomList = [
    ["Cough", "😷", "Dry or persistent cough"],
    ["Breathing Difficulty", "😮‍💨", "Shortness of breath"],
    ["Eye Irritation", "👁️", "Burning or watery eyes"],
    ["Sneezing", "🤧", "Frequent sneezing"],
    ["Headache", "🤕", "Head discomfort"],
    ["Fatigue", "😴", "Feeling unusually tired"],
    ["Runny Nose", "🤧", "Nasal irritation"],
    ["Throat Irritation", "🗣️", "Scratchy throat"],
  ];

  const toggleSymptom = (name) => {
    setSymptoms((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  };

  const symptomStatus = () => {
    if (symptoms.length === 0) {
      return {
        title: "No symptoms selected",
        text: "Select symptoms to receive an environmental exposure insight.",
        icon: "🌿",
      };
    }

    if (
      symptoms.includes("Breathing Difficulty") ||
      symptoms.length >= 5
    ) {
      return {
        title: "High Attention",
        text: "Multiple symptoms may indicate increased environmental sensitivity.",
        icon: "⚠️",
      };
    }

    if (symptoms.length >= 3) {
      return {
        title: "Moderate Attention",
        text: "Your selected symptoms may be associated with environmental irritants.",
        icon: "🟡",
      };
    }

    return {
      title: "Low Attention",
      text: "A few symptoms are present. Monitor how you feel outdoors.",
      icon: "🟢",
    };
  };

  /* =========================
     HOME
  ========================= */

  const Home = () => (
    <>
      <section className="hero-section">

        <div className="hero-overlay"></div>

        <div className="hero-leaf leaf-one">🍃</div>
        <div className="hero-leaf leaf-two">🌿</div>

        <div className="hero-content">

          <div className="hero-badge">
            ✨ AI-POWERED PERSONAL AIR INTELLIGENCE
          </div>

          <h1>
            Breathe Smarter.
            <br />
            <span>Travel Safer.</span>
          </h1>

          <p className="hero-description">
            AeroHealth AI combines real-time air quality,
            environmental conditions and your personal
            health profile to help you make healthier
            outdoor decisions.
          </p>

          <div className="hero-buttons">

            <button
              className="hero-primary"
              onClick={() => goTo("health")}
            >
              ❤️ Check My Personal Risk
              <span>→</span>
            </button>

            <button
              className="hero-secondary"
              onClick={() => goTo("route")}
            >
              🗺️ Find Clean-Air Route
              <span>→</span>
            </button>

          </div>

        </div>

        {/* AQI FLOATING CARD */}

        <div className="aqi-floating-card">

          <div className="aqi-card-header">
            <div>
              <small>CURRENT AIR QUALITY</small>
              <p>📍 Pune, Maharashtra</p>
            </div>

            <span className="moderate-pill">
              ● Moderate
            </span>
          </div>

          <div className="aqi-main">

            <div className="aqi-circle">
              <strong>86</strong>
              <span>AQI</span>
            </div>

            <div className="aqi-values">

              <div>
                <span>PM2.5</span>
                <strong>34 µg/m³</strong>
              </div>

              <div>
                <span>PM10</span>
                <strong>58 µg/m³</strong>
              </div>

              <div>
                <span>Humidity</span>
                <strong>62%</strong>
              </div>

            </div>

          </div>

          <div className="aqi-message">
            🌿 Air quality is currently moderate
          </div>

        </div>

      </section>


      {/* FEATURE SECTION */}

      <section className="features-section">

        <div className="decorative-leaves left-leaves">
          🌿
          <br />
          🍃
        </div>

        <div className="section-intro">

          <div>
            <span>SMART AIR INTELLIGENCE</span>

            <h2>
              Designed Around
              <br />
              <strong>Your Health</strong>
            </h2>

            <p>
              Go beyond generic AQI numbers with
              personalized environmental insights.
            </p>
          </div>

          <div className="mini-leaf">
            🌱
          </div>

        </div>

        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-icon green-icon">
              ❤️
            </div>

            <h3>Personal Health Risk</h3>

            <p>
              Understand how current air conditions
              may affect you based on your health profile.
            </p>

            <button onClick={() => goTo("health")}>
              Check Risk <span>→</span>
            </button>

          </div>


          <div className="feature-card featured-card">

            <div className="feature-icon green-icon">
              🌿
            </div>

            <h3>Clean-Air Route</h3>

            <p>
              Find routes that prioritize lower
              pollution exposure instead of only distance.
            </p>

            <button onClick={() => goTo("route")}>
              Find Route <span>→</span>
            </button>

          </div>


          <div className="feature-card">

            <div className="feature-icon purple-icon">
              🩺
            </div>

            <h3>Symptom Checker</h3>

            <p>
              Select symptoms and explore possible
              environmental triggers with simple insights.
            </p>

            <button onClick={() => goTo("symptoms")}>
              Check Symptoms <span>→</span>
            </button>

          </div>

        </div>

      </section>


      {/* ENVIRONMENT SECTION */}

      <section className="environment-section">

        <div className="environment-overlay"></div>

        <div className="environment-content">

          <div className="environment-title">

            <span>🌿 ENVIRONMENT SNAPSHOT</span>

            <h2>
              Today's Conditions
            </h2>

            <p>
              Stay informed. Travel healthier.
            </p>

          </div>

          <div className="environment-cards">

            <div className="environment-card">
              <span>☀️</span>
              <small>Temperature</small>
              <strong>27°C</strong>
            </div>

            <div className="environment-card">
              <span>💨</span>
              <small>Wind Speed</small>
              <strong>12 km/h</strong>
            </div>

            <div className="environment-card">
              <span>☁️</span>
              <small>Weather</small>
              <strong>Partly Cloudy</strong>
            </div>

            <div className="environment-card">
              <span>🌱</span>
              <small>Outdoor Advice</small>
              <strong>Stay Aware</strong>
            </div>

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="bottom-cta">

        <div>
          <span>🌿 A HEALTHIER WAY TO MOVE</span>

          <h2>
            Your air.
            <br />
            Your health.
            <br />
            Your journey.
          </h2>
        </div>

        <button onClick={() => goTo("health")}>
          Start Your Health Profile →
        </button>

      </section>

    </>
  );


  /* =========================
     HEALTH PROFILE
  ========================= */

  const HealthProfile = () => (
    <section className="page-section">

      <button
        className="back-button"
        onClick={() => goTo("home")}
      >
        ← Back to Home
      </button>

      <div className="profile-layout">

        <div className="profile-image">
          <div className="image-overlay">
            <span>🌿 PERSONALIZED AIR INTELLIGENCE</span>

            <h1>
              Know your air.
              <br />
              Know your risk.
            </h1>

            <p>
              Your profile helps us understand
              your environmental exposure.
            </p>
          </div>
        </div>


        <div className="profile-form-card">

          <div className="form-icon">
            ❤️
          </div>

          <span className="small-heading">
            PERSONAL HEALTH PROFILE
          </span>

          <h2>
            Tell us about yourself
          </h2>

          <p>
            This information helps AeroHealth AI
            personalize your exposure insights.
          </p>


          <div className="input-group">

            <label>Age</label>

            <input
              type="number"
              name="age"
              placeholder="Enter your age"
              value={formData.age}
              onChange={handleChange}
            />

          </div>


          <div className="input-group">

            <label>Health Condition</label>

            <select
              name="health"
              value={formData.health}
              onChange={handleChange}
            >
              <option>Normal</option>
              <option>Asthma</option>
              <option>Allergy</option>
              <option>Other</option>
            </select>

          </div>


          <div className="input-group">

            <label>Travel Mode</label>

            <select
              name="travel"
              value={formData.travel}
              onChange={handleChange}
            >
              <option>Walking</option>
              <option>Cycling</option>
              <option>Two-wheeler</option>
              <option>Car</option>
              <option>Public Transport</option>
            </select>

          </div>


          <button
            className="main-green-button"
            onClick={() => {
              if (!formData.age) {
                alert("Please enter your age first.");
                return;
              }

              goTo("risk");
            }}
          >
            Calculate My Risk →
          </button>

        </div>

      </div>

    </section>
  );


  /* =========================
     RISK
  ========================= */

  const RiskPage = () => (
    <section className="page-section">

      <button
        className="back-button"
        onClick={() => goTo("health")}
      >
        ← Edit Profile
      </button>

      <div className="risk-card">

        <div className="risk-icon">
          📊
        </div>

        <span className="small-heading">
          PERSONAL EXPOSURE RESULT
        </span>

        <h1>
          Your profile is ready
        </h1>

        <div className="profile-summary">

          <div>
            <span>Age</span>
            <strong>{formData.age}</strong>
          </div>

          <div>
            <span>Health</span>
            <strong>{formData.health}</strong>
          </div>

          <div>
            <span>Travel</span>
            <strong>{formData.travel}</strong>
          </div>

        </div>

        <div className="score-circle">
          <span>--</span>
          <small>RISK SCORE</small>
        </div>

        <p className="backend-message">
          Waiting for the personalized Risk
          Calculation Engine from the backend.
        </p>

        <button
          className="outline-button"
          onClick={() => goTo("home")}
        >
          ← Return Home
        </button>

      </div>

    </section>
  );


  /* =========================
     ROUTE
  ========================= */

  const RoutePage = () => (
    <section className="page-section">

      <button
        className="back-button"
        onClick={() => goTo("home")}
      >
        ← Back to Home
      </button>

      <div className="route-header">

        <div className="route-icon">
          🌿
        </div>

        <span className="small-heading">
          CLEAN-AIR NAVIGATION
        </span>

        <h1>
          Find a Cleaner
          <br />
          Way to Travel
        </h1>

        <p>
          Choose a route based on lower pollution
          exposure instead of only distance.
        </p>

      </div>


      <div className="route-panel">

        <div className="route-inputs">

          <div className="input-group">
            <label>Starting Point</label>

            <input
              type="text"
              name="from"
              placeholder="e.g. Pimpri"
              value={routeData.from}
              onChange={handleRouteChange}
            />
          </div>

          <div className="input-group">
            <label>Destination</label>

            <input
              type="text"
              name="to"
              placeholder="e.g. Pune Station"
              value={routeData.to}
              onChange={handleRouteChange}
            />
          </div>

          <div className="input-group">
            <label>Travel Mode</label>

            <select
              name="travel"
              value={routeData.travel}
              onChange={handleRouteChange}
            >
              <option>Walking</option>
              <option>Cycling</option>
              <option>Two-wheeler</option>
              <option>Car</option>
            </select>
          </div>

        </div>

        <button
          className="main-green-button centered-button"
          onClick={findCleanRoute}
        >
          🌿 Find Cleaner Route
        </button>

      </div>


      {/* MAP PREVIEW */}

      <div className="map-preview">

        <div className="map-label">
          🗺️ LIVE ROUTE PREVIEW
        </div>

        <div className="map-road road-one"></div>
        <div className="map-road road-two"></div>
        <div className="map-road road-three"></div>

        <div className="route-line"></div>

        <div className="map-marker marker-a">
          A
        </div>

        <div className="map-marker marker-b">
          B
        </div>

        <div className="map-legend">
          🌿 Lower pollution route
        </div>

      </div>


      {routeSearched && (

        <div className="route-results">

          <div className="route-result-card recommended">

            <span className="recommended-label">
              RECOMMENDED
            </span>

            <h3>
              🌿 Clean-Air Route
            </h3>

            <p>
              Lower pollution exposure with a
              slightly longer journey.
            </p>

            <div className="route-stats">

              <div>
                <span>Distance</span>
                <strong>4.8 km</strong>
              </div>

              <div>
                <span>Time</span>
                <strong>18 min</strong>
              </div>

              <div>
                <span>Exposure</span>
                <strong className="low">
                  Low
                </strong>
              </div>

            </div>

          </div>


          <div className="route-result-card">

            <span className="alternative-label">
              ALTERNATIVE
            </span>

            <h3>
              ⚡ Fastest Route
            </h3>

            <p>
              Faster journey but with higher
              pollution exposure.
            </p>

            <div className="route-stats">

              <div>
                <span>Distance</span>
                <strong>4.2 km</strong>
              </div>

              <div>
                <span>Time</span>
                <strong>14 min</strong>
              </div>

              <div>
                <span>Exposure</span>
                <strong className="moderate">
                  Moderate
                </strong>
              </div>

            </div>

          </div>

        </div>

      )}

    </section>
  );


  /* =========================
     SYMPTOMS
  ========================= */

  const SymptomChecker = () => {

    const status = symptomStatus();

    return (
      <section className="page-section">

        <button
          className="back-button"
          onClick={() => goTo("home")}
        >
          ← Back to Home
        </button>

        <div className="symptom-header">

          <div className="symptom-icon">
            🩺
          </div>

          <span className="small-heading">
            AI SYMPTOM CHECKER
          </span>

          <h1>
            How are you feeling today?
          </h1>

          <p>
            Select the symptoms you are experiencing
            and explore possible environmental triggers.
          </p>

        </div>


        <div className="symptom-panel">

          <div className="symptom-panel-top">

            <div>
              <h2>Select your symptoms</h2>
              <p>You can select more than one.</p>
            </div>

            <span className="selected-count">
              {symptoms.length} Selected
            </span>

          </div>


          <div className="symptom-grid">

            {symptomList.map(([name, icon, description]) => {

              const selected =
                symptoms.includes(name);

              return (
                <button
                  className={`symptom-card ${
                    selected ? "selected" : ""
                  }`}
                  key={name}
                  onClick={() => toggleSymptom(name)}
                >

                  <span className="symptom-emoji">
                    {icon}
                  </span>

                  {selected && (
                    <span className="check-mark">
                      ✓
                    </span>
                  )}

                  <strong>{name}</strong>

                  <small>
                    {description}
                  </small>

                </button>
              );

            })}

          </div>

          {symptoms.length > 0 && (
            <button
              className="clear-button"
              onClick={() => setSymptoms([])}
            >
              ✕ Clear all symptoms
            </button>
          )}

        </div>


        <div className="symptom-analysis">

          <div className="analysis-card">

            <span className="small-heading">
              EXPOSURE INSIGHT
            </span>

            <div className="analysis-title">

              <span>
                {status.icon}
              </span>

              <div>
                <h3>{status.title}</h3>
                <small>
                  Based on selected symptoms
                </small>
              </div>

            </div>

            <p>
              {status.text}
            </p>

          </div>


          <div className="analysis-card triggers-card">

            <span className="small-heading">
              POSSIBLE ENVIRONMENTAL TRIGGERS
            </span>

            <div className="trigger-list">

              <span>🌫️ Air Pollution</span>
              <span>🌿 Pollen</span>
              <span>💨 Dust</span>
              <span>🚗 Traffic Emissions</span>

            </div>

          </div>

        </div>


        <div className="health-warning">

          ⚠️ <strong>Health note:</strong>

          This tool provides general environmental
          insights and is not a medical diagnosis.
          If you experience severe symptoms or
          breathing difficulty, seek appropriate
          medical care.

        </div>

      </section>
    );
  };


  return (
    <div className="app">

      {/* NAVBAR */}

      <nav className="navbar">

        <div
          className="brand"
          onClick={() => goTo("home")}
        >

          <span className="brand-icon">
            🌿
          </span>

          <span>
            AeroHealth <b>AI</b>
          </span>

        </div>


        <div className="nav-links">

          {navItems.map(([id, label]) => (
            <button
              key={id}
              onClick={() => goTo(id)}
            >
              {label}
            </button>
          ))}

        </div>


        <button
          className="profile-button"
          onClick={() => goTo("health")}
        >
          👤 My Profile
        </button>

      </nav>


      {/* PAGES */}

      {page === "home" && <Home />}

      {page === "health" && <HealthProfile />}

      {page === "risk" && <RiskPage />}

      {page === "route" && <RoutePage />}

      {page === "symptoms" && <SymptomChecker />}


      {/* FOOTER */}

      <footer className="footer">

        <div className="brand footer-brand">
          <span className="brand-icon">
            🌿
          </span>

          AeroHealth <b>AI</b>
        </div>

        <p>
          Personalized exposure intelligence
          for healthier journeys.
        </p>

        <span>
          © 2026 AeroHealth AI
        </span>

      </footer>

    </div>
  );
}

export default App;