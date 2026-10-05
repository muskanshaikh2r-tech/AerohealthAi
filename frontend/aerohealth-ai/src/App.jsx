import React, { useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./styles.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
});

const environment = {
  aqi: 118,
  pm25: 54,
  temperature: 29,
  humidity: 64,
  wind: 9,
  weather: "Partly cloudy"
};

const routes = {
  fastest: {
    name: "Fastest Route",
    distance: 6.2,
    duration: 18,
    exposure: "Moderate–High",
    score: 72
  },
  cleaner: {
    name: "Cleaner Route",
    distance: 6.7,
    duration: 21,
    exposure: "Lower",
    score: 48
  }
};

const symptoms = [
  "Cough",
  "Breathing discomfort",
  "Eye irritation",
  "Headache",
  "Throat irritation"
];

function calculateRisk(profile) {
  let score = 0;

  if (environment.aqi <= 50) score += 10;
  else if (environment.aqi <= 100) score += 25;
  else if (environment.aqi <= 150) score += 45;
  else if (environment.aqi <= 200) score += 65;
  else score += 80;

  if (environment.pm25 <= 12) score += 5;
  else if (environment.pm25 <= 35) score += 15;
  else if (environment.pm25 <= 55) score += 25;
  else score += 35;

  if (profile.sensitivity === "High") score += 20;
  else if (profile.sensitivity === "Moderate") score += 10;

  if (Number(profile.duration) >= 60) score += 15;
  else if (Number(profile.duration) >= 30) score += 8;

  if (
    profile.travelMode === "Walking" ||
    profile.travelMode === "Cycling"
  ) {
    score += 10;
  }

  if (Number(profile.age) >= 60) score += 10;

  score = Math.min(100, Math.round(score));

  let level = "Low";

  if (score >= 65) level = "High";
  else if (score >= 40) level = "Moderate";

  return { score, level };
}

function getGuidance(level) {
  if (level === "High") {
    return [
      "Consider postponing non-essential outdoor travel.",
      "Prefer a potentially lower-exposure route.",
      "Monitor current environmental conditions.",
      "Reduce prolonged outdoor exposure where practical."
    ];
  }

  if (level === "Moderate") {
    return [
      "Consider choosing a lower-exposure route.",
      "Reduce unnecessary outdoor exposure.",
      "Monitor environmental conditions during travel.",
      "Take breaks during longer outdoor journeys."
    ];
  }

  return [
    "Current conditions indicate relatively lower exposure.",
    "Continue monitoring environmental conditions.",
    "Stay hydrated during longer journeys.",
    "Use route comparison when conditions change."
  ];
}

export default function App() {
  const [page, setPage] = useState("home");

  const [profile, setProfile] = useState({
    age: 21,
    travelMode: "Walking",
    sensitivity: "Moderate",
    duration: 30,
    location: "Pune",
    destination: "Pimpri-Chinchwad"
  });

  const [risk, setRisk] = useState(null);

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const [selectedRoute, setSelectedRoute] = useState("cleaner");

  const guidance = useMemo(() => {
    if (!risk) return [];
    return getGuidance(risk.level);
  }, [risk]);

  function updateProfile(field, value) {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  }

  function analyzeRisk() {
    const result = calculateRisk(profile);
    setRisk(result);
    setPage("risk");
  }

  function toggleSymptom(symptom) {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(item => item !== symptom)
        : [...prev, symptom]
    );
  }

  function Home() {
    return (
      <div>
        <section className="hero">

          <div className="hero-content">

            <div className="eyebrow">
              PERSONALIZED ENVIRONMENTAL HEALTH
            </div>

            <h1>
              Breathe Smarter.
              <br />
              <span>Travel Safer.</span>
            </h1>

            <p>
              AeroHealth AI combines your personal health
              context with environmental conditions to
              estimate exposure risk and help you choose
              potentially cleaner routes.
            </p>

            <div className="hero-buttons">

              <button
                className="primary-button"
                onClick={() => setPage("profile")}
              >
                Check My Risk →
              </button>

              <button
                className="secondary-button"
                onClick={() => setPage("routes")}
              >
                Plan a Safer Route
              </button>

            </div>

          </div>

          <div className="hero-visual">

            <div className="shield">
              🛡️
            </div>

            <div className="hero-floating-card">

              <strong>
                Personalized Safety
              </strong>

              <span>
                Health + Environment + Travel
              </span>

            </div>

          </div>

        </section>

        <section className="section">

          <div className="section-heading">

            <div className="eyebrow">
              HOW AEROHEALTH WORKS
            </div>

            <h2>
              From environmental data to
              <span> practical action.</span>
            </h2>

          </div>

          <div className="feature-grid">

            <Feature
              icon="👤"
              title="Health Profile"
              text="Considers age, environmental sensitivity and travel mode."
            />

            <Feature
              icon="🌫️"
              title="Environmental Data"
              text="Uses AQI, PM2.5, weather and location conditions."
            />

            <Feature
              icon="🧠"
              title="Personal Risk"
              text="Combines environmental conditions with user context."
            />

            <Feature
              icon="🗺️"
              title="Cleaner Route"
              text="Compares routes based on potential environmental exposure."
            />

          </div>

        </section>
      </div>
    );
  }

  function Profile() {
    return (
      <div className="page narrow">

        <div className="page-header">

          <div className="eyebrow">
            STEP 1
          </div>

          <h1>
            Tell us about your journey.
          </h1>

          <p>
            Your information helps AeroHealth AI personalize
            your environmental exposure assessment.
          </p>

        </div>

        <div className="form-card">

          <div className="form-grid">

            <Field label="Age">
              <input
                type="number"
                value={profile.age}
                onChange={e =>
                  updateProfile("age", e.target.value)
                }
              />
            </Field>

            <Field label="Travel Mode">
              <select
                value={profile.travelMode}
                onChange={e =>
                  updateProfile("travelMode", e.target.value)
                }
              >
                <option>Walking</option>
                <option>Cycling</option>
                <option>Two-wheeler</option>
                <option>Car</option>
                <option>Public Transport</option>
              </select>
            </Field>

            <Field label="Environmental Sensitivity">
              <select
                value={profile.sensitivity}
                onChange={e =>
                  updateProfile("sensitivity", e.target.value)
                }
              >
                <option>Low</option>
                <option>Moderate</option>
                <option>High</option>
              </select>
            </Field>

            <Field label="Travel Duration">
              <select
                value={profile.duration}
                onChange={e =>
                  updateProfile("duration", e.target.value)
                }
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60+ minutes</option>
              </select>
            </Field>

            <Field label="Current Location">
              <input
                value={profile.location}
                onChange={e =>
                  updateProfile("location", e.target.value)
                }
              />
            </Field>

            <Field label="Destination">
              <input
                value={profile.destination}
                onChange={e =>
                  updateProfile("destination", e.target.value)
                }
              />
            </Field>

          </div>

          <button
            className="primary-button full"
            onClick={analyzeRisk}
          >
            Analyze My Exposure →
          </button>

        </div>

      </div>
    );
  }

  function RiskPage() {

    if (!risk) {
      return (
        <div className="empty">
          <h2>Create your profile first.</h2>

          <button
            className="primary-button"
            onClick={() => setPage("profile")}
          >
            Create Profile
          </button>
        </div>
      );
    }

    return (
      <div className="page">

        <div className="page-header">

          <div className="eyebrow">
            PERSONALIZED RISK ANALYSIS
          </div>

          <h1>
            Your environmental exposure
            <span> overview.</span>
          </h1>

        </div>

        <div className="risk-grid">

          <div className="risk-card">

            <div className="risk-circle">

              <strong>
                {risk.score}
              </strong>

              <small>
                / 100
              </small>

            </div>

            <div
              className={`risk-badge ${risk.level.toLowerCase()}`}
            >
              {risk.level} Exposure
            </div>

            <p>
              Your score combines environmental conditions
              with your health and travel context.
            </p>

          </div>

          <div className="environment-card">

            <h2>
              Current Environmental Conditions
            </h2>

            <div className="metrics">

              <Metric
                icon="🌫️"
                label="AQI"
                value={environment.aqi}
                sub="Moderate"
              />

              <Metric
                icon="🫁"
                label="PM2.5"
                value={`${environment.pm25} µg/m³`}
                sub="Elevated"
              />

              <Metric
                icon="🌡️"
                label="Temperature"
                value={`${environment.temperature}°C`}
                sub={environment.weather}
              />

              <Metric
                icon="💨"
                label="Wind"
                value={`${environment.wind} km/h`}
                sub="Current"
              />

            </div>

          </div>

        </div>

        <div className="influence-card">

          <h2>
            What influenced your score?
          </h2>

          <div className="chips">

            <span>AQI</span>
            <span>PM2.5</span>
            <span>Health Context</span>
            <span>Travel Mode</span>
            <span>Travel Duration</span>

          </div>

        </div>

        <div className="action-row">

          <button
            className="primary-button"
            onClick={() => setPage("routes")}
          >
            Find Cleaner Routes →
          </button>

          <button
            className="secondary-button"
            onClick={() => setPage("symptoms")}
          >
            Check Symptoms
          </button>

        </div>

      </div>
    );
  }

  function Routes() {

    const start = [18.5204, 73.8567];

    const destination = [18.6298, 73.7997];

    const fastestRoute = [
      start,
      [18.55, 73.84],
      [18.58, 73.82],
      destination
    ];

    const cleanerRoute = [
      start,
      [18.54, 73.87],
      [18.58, 73.85],
      [18.61, 73.83],
      destination
    ];

    return (
      <div className="page">

        <div className="page-header">

          <div className="eyebrow">
            ROUTE PLANNER
          </div>

          <h1>
            Find a potentially
            <span> cleaner route.</span>
          </h1>

          <p>
            Compare travel time and potential environmental exposure.
          </p>

        </div>

        <div className="route-layout">

          <div className="map-container">

            <MapContainer
              center={start}
              zoom={12}
              scrollWheelZoom
              className="map"
            >

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={start}>
                <Popup>
                  Current Location
                </Popup>
              </Marker>

              <Marker position={destination}>
                <Popup>
                  Destination
                </Popup>
              </Marker>

              <Polyline
                positions={fastestRoute}
                pathOptions={{
                  color: "#d9534f",
                  weight: 6,
                  opacity:
                    selectedRoute === "fastest"
                      ? 0.95
                      : 0.25
                }}
              />

              <Polyline
                positions={cleanerRoute}
                pathOptions={{
                  color: "#2e9b5f",
                  weight: 6,
                  opacity:
                    selectedRoute === "cleaner"
                      ? 0.95
                      : 0.25
                }}
              />

              <Circle
                center={[18.57, 73.84]}
                radius={1800}
                pathOptions={{
                  color: "#e9a23b",
                  fillOpacity: 0.12
                }}
              />

            </MapContainer>

          </div>

          <div className="route-options">

            <RouteCard
              route={routes.fastest}
              selected={selectedRoute === "fastest"}
              onClick={() => setSelectedRoute("fastest")}
            />

            <RouteCard
              route={routes.cleaner}
              selected={selectedRoute === "cleaner"}
              recommended
              onClick={() => setSelectedRoute("cleaner")}
            />

          </div>

        </div>

        <div className="recommendation">

          <div className="recommendation-icon">
            🌿
          </div>

          <div className="recommendation-content">

            <strong>
              Recommended: Cleaner Route
            </strong>

            <p>
              Slightly longer, but potentially lower
              environmental exposure.
            </p>

          </div>

          <button
            className="primary-button"
            onClick={() => setPage("guidance")}
          >
            Choose Route →
          </button>

        </div>

      </div>
    );
  }

  function Guidance() {

    return (
      <div className="page narrow">

        <div className="page-header centered">

          <div className="eyebrow">
            ACTIONABLE GUIDANCE
          </div>

          <h1>
            What you can do.
          </h1>

          <p>
            AeroHealth AI converts environmental information
            into practical travel guidance.
          </p>

        </div>

        <div className="guidance-card">

          {guidance.map((item, index) => (

            <div
              className="guidance-item"
              key={index}
            >

              <div className="check">
                ✓
              </div>

              <span>
                {item}
              </span>

            </div>

          ))}

        </div>

        <div className="decision-card">

          <div className="decision-icon">
            🧠
          </div>

          <h2>
            DATA → INTERPRETATION → ACTION
          </h2>

          <p>
            Instead of only reporting environmental conditions,
            AeroHealth AI converts them into personalized exposure
            information and a practical travel recommendation.
          </p>

        </div>

      </div>
    );
  }

  function Symptoms() {

    const alert =
      selectedSymptoms.length > 0 &&
      environment.aqi >= 100;

    return (
      <div className="page narrow">

        <div className="page-header">

          <div className="eyebrow">
            SUPPORTING FEATURE
          </div>

          <h1>
            How are you feeling?
          </h1>

          <p>
            This feature provides environmental awareness,
            not medical diagnosis.
          </p>

        </div>

        <div className="symptom-card">

          <div className="symptoms">

            {symptoms.map(symptom => (

              <button
                key={symptom}
                className={`symptom ${
                  selectedSymptoms.includes(symptom)
                    ? "selected"
                    : ""
                }`}
                onClick={() => toggleSymptom(symptom)}
              >

                <span>
                  {
                    selectedSymptoms.includes(symptom)
                      ? "✓"
                      : "○"
                  }
                </span>

                {symptom}

              </button>

            ))}

          </div>

          <div className="symptom-result">

            <strong>
              Environmental Context
            </strong>

            {alert ? (
              <p>
                Your reported symptoms may coincide with
                current environmental conditions. Consider
                reducing prolonged outdoor exposure and
                monitoring environmental conditions.
              </p>
            ) : (
              <p>
                Select symptoms above to view environmental
                awareness guidance.
              </p>
            )}

          </div>

        </div>

      </div>
    );
  }

  return (
    <>
      <header className="navbar">

        <button
          className="logo"
          onClick={() => setPage("home")}
        >
          <span className="logo-icon">
            ✦
          </span>

          AeroHealth
          <small>AI</small>
        </button>

        <nav>

          <button onClick={() => setPage("home")}>
            Home
          </button>

          <button onClick={() => setPage("profile")}>
            Health Profile
          </button>

          <button onClick={() => setPage("risk")}>
            Risk Analysis
          </button>

          <button onClick={() => setPage("routes")}>
            Route Planner
          </button>

        </nav>

        <button
          className="nav-cta"
          onClick={() => setPage("profile")}
        >
          Check My Risk
        </button>

      </header>

      <main>

        {page === "home" && <Home />}

        {page === "profile" && <Profile />}

        {page === "risk" && <RiskPage />}

        {page === "routes" && <Routes />}

        {page === "guidance" && <Guidance />}

        {page === "symptoms" && <Symptoms />}

      </main>

      <footer>

        <strong>
          AeroHealth AI
        </strong>

        <span>
          Personalized environmental-health decision support.
        </span>

      </footer>
    </>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="feature-card">

      <div className="feature-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>
  );
}

function Metric({ icon, label, value, sub }) {
  return (
    <div className="metric">

      <div className="metric-icon">
        {icon}
      </div>

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

        <small>
          {sub}
        </small>

      </div>

    </div>
  );
}

function RouteCard({
  route,
  selected,
  recommended,
  onClick
}) {
  return (
    <button
      className={`route-card ${
        selected ? "route-selected" : ""
      }`}
      onClick={onClick}
    >

      <div className="route-top">

        <div>

          <span className="route-name">
            {route.name}
          </span>

          {recommended && (
            <span className="recommended">
              RECOMMENDED
            </span>
          )}

        </div>

        <span className="radio">
          {selected ? "●" : "○"}
        </span>

      </div>

      <div className="route-details">

        <div>
          <strong>
            {route.distance} km
          </strong>
          <span>Distance</span>
        </div>

        <div>
          <strong>
            {route.duration} min
          </strong>
          <span>Time</span>
        </div>

        <div>
          <strong>
            {route.score}/100
          </strong>
          <span>Exposure</span>
        </div>

      </div>

      <div
        className={`exposure ${
          route.score <= 50
            ? "low"
            : "high"
        }`}
      >
        {route.exposure} exposure
      </div>

    </button>
  );
}
