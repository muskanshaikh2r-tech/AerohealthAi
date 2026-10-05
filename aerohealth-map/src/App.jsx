import { useEffect, useMemo, useState } from "react";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import pollutionData from "./pollutiondata";

import "leaflet/dist/leaflet.css";
import "./App.css";


// =====================================================
// AQI INFORMATION
// =====================================================

function getAQIInfo(aqi) {
  if (aqi <= 50) {
    return {
      label: "Good",
      className: "good",
      color: "#22c55e",
    };
  }

  if (aqi <= 100) {
    return {
      label: "Satisfactory",
      className: "satisfactory",
      color: "#84cc16",
    };
  }

  if (aqi <= 200) {
    return {
      label: "Moderate",
      className: "moderate",
      color: "#eab308",
    };
  }

  if (aqi <= 300) {
    return {
      label: "Poor",
      className: "poor",
      color: "#f97316",
    };
  }

  if (aqi <= 400) {
    return {
      label: "Very Poor",
      className: "very-poor",
      color: "#ef4444",
    };
  }

  return {
    label: "Severe",
    className: "severe",
    color: "#7f1d1d",
  };
}


// =====================================================
// DISTANCE CALCULATION
// =====================================================

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return (
    R *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}


// =====================================================
// FIND NEAREST POLLUTION LOCATION
// =====================================================

function findNearestPollution(lat, lon) {
  let nearest = pollutionData[0];
  let shortestDistance = Infinity;

  pollutionData.forEach((point) => {
    const distance = getDistance(
      lat,
      lon,
      point.lat,
      point.lon
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearest = point;
    }
  });

  return nearest;
}


// =====================================================
// CALCULATE ROUTE AQI
// =====================================================

function calculateRouteAQI(coordinates) {
  if (!coordinates || coordinates.length === 0) {
    return 0;
  }

  const step = Math.max(
    1,
    Math.floor(coordinates.length / 20)
  );

  const values = [];

  for (
    let i = 0;
    i < coordinates.length;
    i += step
  ) {
    const [lon, lat] = coordinates[i];

    const nearest = findNearestPollution(
      lat,
      lon
    );

    values.push(nearest.aqi);
  }

  if (values.length === 0) {
    return 0;
  }

  const average =
    values.reduce(
      (sum, value) => sum + value,
      0
    ) / values.length;

  return Math.round(average);
}


// =====================================================
// MAP AUTO ZOOM
// =====================================================

function RouteZoom({ route }) {
  const map = useMap();

  useEffect(() => {
    if (
      !route ||
      !route.geometry ||
      !route.geometry.coordinates
    ) {
      return;
    }

    const points =
      route.geometry.coordinates.map(
        ([lon, lat]) => [lat, lon]
      );

    map.fitBounds(points, {
      padding: [45, 45],
    });
  }, [route, map]);

  return null;
}


// =====================================================
// START / DESTINATION MARKERS
// =====================================================

const startIcon = L.divIcon({
  className: "custom-marker",
  html: `
    <div class="start-marker">
      A
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});


const destinationIcon = L.divIcon({
  className: "custom-marker",
  html: `
    <div class="destination-marker">
      B
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});


// =====================================================
// MAIN APP
// =====================================================

function App() {

  const [fromName, setFromName] =
    useState("Pune");

  const [toName, setToName] =
    useState("Lonavala");

  const [route, setRoute] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [weather, setWeather] =
    useState(null);


  // ===================================================
  // SELECT LOCATIONS
  // ===================================================

  const from = useMemo(
    () =>
      pollutionData.find(
        (place) =>
          place.name === fromName
      ),
    [fromName]
  );

  const to = useMemo(
    () =>
      pollutionData.find(
        (place) =>
          place.name === toName
      ),
    [toName]
  );


  // ===================================================
  // FETCH WEATHER
  // ===================================================

  useEffect(() => {

    if (!from) return;

    async function getWeather() {

      try {

        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${from.lat}` +
          `&longitude=${from.lon}` +
          `&current=temperature_2m,relative_humidity_2m` +
          `&timezone=auto`;

        const response =
          await fetch(url);

        const data =
          await response.json();

        setWeather(data.current);

      } catch (err) {

        console.log(
          "Weather error:",
          err
        );

        setWeather(null);
      }
    }

    getWeather();

  }, [from]);


  // ===================================================
  // FIND ROUTE
  // ===================================================

  async function findRoute() {

    if (!from || !to) return;

    if (from.name === to.name) {

      setError(
        "Please select different locations."
      );

      return;
    }

    try {

      setLoading(true);
      setError("");
      setRoute(null);

      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${from.lon},${from.lat};${to.lon},${to.lat}` +
        `?overview=full&geometries=geojson`;

      const response =
        await fetch(url);

      if (!response.ok) {
        throw new Error(
          "Routing service unavailable"
        );
      }

      const data =
        await response.json();

      if (
        !data.routes ||
        data.routes.length === 0
      ) {
        throw new Error(
          "No route found"
        );
      }

      const selectedRoute =
        data.routes[0];

      const averageAQI =
        calculateRouteAQI(
          selectedRoute.geometry.coordinates
        );

      setRoute({
        ...selectedRoute,
        averageAQI,
      });

    } catch (err) {

      console.error(err);

      setError(
        "Unable to calculate the route. Please try again."
      );

    } finally {

      setLoading(false);
    }
  }


  // ===================================================
  // FORMATTERS
  // ===================================================

  function formatDistance(meters) {

    return `${(
      meters / 1000
    ).toFixed(1)} km`;

  }


  function formatTime(seconds) {

    const minutes =
      Math.round(seconds / 60);

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours =
      Math.floor(minutes / 60);

    const remaining =
      minutes % 60;

    return `${hours}h ${remaining}m`;
  }


  // ===================================================
  // CURRENT AQI
  // ===================================================

  const currentAQI =
    from?.aqi || 0;

  const currentAQIInfo =
    getAQIInfo(currentAQI);


  // ===================================================
  // MAP CENTER
  // ===================================================

  const mapCenter = [
    (from.lat + to.lat) / 2,
    (from.lon + to.lon) / 2,
  ];


  // ===================================================
  // UI
  // ===================================================

  return (

    <div className="app">

      {/* =============================================
          HEADER
      ============================================= */}

      <header className="top-header">

        <div className="brand-section">

          <div className="brand-icon">
            🌿
          </div>

          <div>

            <h1>
              AeroHealth AI
            </h1>

            <p>
              Personalized Exposure & Clean-Air Route Engine
            </p>

          </div>

        </div>

        <div className="header-status">
          Environmental Route Planner
        </div>

      </header>


      <main className="page-container">


        {/* =============================================
            ROUTE PLANNER
        ============================================= */}

        <section className="planner-section">

          <div className="section-heading">

            <div className="heading-icon">
              🗺️
            </div>

            <div>

              <h2>
                Clean-Air Route Planner
              </h2>

              <p>
                Select your starting point and destination
                to find an environmentally informed route.
              </p>

            </div>

          </div>


          <div className="planner-content">

            <div className="location-box">

              <span className="field-label">
                FROM
              </span>

              <select
                value={fromName}
                onChange={(e) =>
                  setFromName(
                    e.target.value
                  )
                }
              >

                {pollutionData.map(
                  (place) => (

                    <option
                      key={place.name}
                      value={place.name}
                    >
                      {place.name}
                    </option>

                  )
                )}

              </select>

            </div>


            <div className="direction-arrow">
              →
            </div>


            <div className="location-box">

              <span className="field-label">
                TO
              </span>

              <select
                value={toName}
                onChange={(e) =>
                  setToName(
                    e.target.value
                  )
                }
              >

                {pollutionData.map(
                  (place) => (

                    <option
                      key={place.name}
                      value={place.name}
                    >
                      {place.name}
                    </option>

                  )
                )}

              </select>

            </div>


            <button
              className="find-route-button"
              onClick={findRoute}
              disabled={loading}
            >

              {loading
                ? "Finding Route..."
                : "Find Clean-Air Route"}

            </button>

          </div>


          {error && (

            <div className="error-message">
              ⚠️ {error}
            </div>

          )}

        </section>



        {/* =============================================
            CURRENT ENVIRONMENT
        ============================================= */}

        <section className="environment-section">

          <div className="section-title">

            <div>

              <span className="small-title">
                CURRENT CONDITIONS
              </span>

              <h2>
                Environmental Status
              </h2>

              <p>
                Current conditions around{" "}
                <strong>
                  {from.name}
                </strong>
              </p>

            </div>

          </div>


          <div className="environment-cards">


            {/* AQI */}

            <div className="environment-card">

              <div className="environment-icon aqi-icon">
                🌫️
              </div>

              <div className="environment-info">

                <span>
                  Air Quality Index
                </span>

                <div className="value-line">

                  <strong>
                    {currentAQI}
                  </strong>

                  <span
                    className={`status-badge ${currentAQIInfo.className}`}
                  >
                    {currentAQIInfo.label}
                  </span>

                </div>

                <small>
                  Current AQI level
                </small>

              </div>

            </div>


            {/* PM2.5 */}

            <div className="environment-card">

              <div className="environment-icon pm-icon">
                🫁
              </div>

              <div className="environment-info">

                <span>
                  PM2.5
                </span>

                <div className="value-line">

                  <strong>
                    {from.pm25}
                  </strong>

                  <small className="unit">
                    µg/m³
                  </small>

                </div>

                <small>
                  Fine particulate matter
                </small>

              </div>

            </div>


            {/* TEMPERATURE */}

            <div className="environment-card">

              <div className="environment-icon temp-icon">
                🌡️
              </div>

              <div className="environment-info">

                <span>
                  Temperature
                </span>

                <div className="value-line">

                  <strong>
                    {weather
                      ? weather.temperature_2m
                      : "--"}
                  </strong>

                  <small className="unit">
                    °C
                  </small>

                </div>

                <small>
                  Current temperature
                </small>

              </div>

            </div>


            {/* HUMIDITY */}

            <div className="environment-card">

              <div className="environment-icon humidity-icon">
                💧
              </div>

              <div className="environment-info">

                <span>
                  Humidity
                </span>

                <div className="value-line">

                  <strong>
                    {weather
                      ? weather.relative_humidity_2m
                      : "--"}
                  </strong>

                  <small className="unit">
                    %
                  </small>

                </div>

                <small>
                  Relative humidity
                </small>

              </div>

            </div>

          </div>

        </section>



        {/* =============================================
            MAP
        ============================================= */}

        <section className="map-section">

          <div className="map-heading">

            <div>

              <span className="small-title">
                LIVE ROUTE VIEW
              </span>

              <h2>
                Environmental Route Map
              </h2>

            </div>

            <div className="map-location">
              {from.name} → {to.name}
            </div>

          </div>


          <div className="map-container">

            <MapContainer
              center={mapCenter}
              zoom={9}
              scrollWheelZoom={true}
              className="leaflet-map"
            >

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />


              {/* POLLUTION LOCATIONS */}

              {pollutionData.map(
                (point) => {

                  const info =
                    getAQIInfo(
                      point.aqi
                    );

                  return (

                    <CircleMarker
                      key={point.name}
                      center={[
                        point.lat,
                        point.lon,
                      ]}
                      radius={9}
                      pathOptions={{
                        color: info.color,
                        fillColor:
                          info.color,
                        fillOpacity: 0.7,
                        weight: 2,
                      }}
                    >

                      <Popup>

                        <div className="popup-content">

                          <h3>
                            {point.name}
                          </h3>

                          <div>
                            AQI:
                            <strong>
                              {" "}
                              {point.aqi}
                            </strong>
                          </div>

                          <div>
                            PM2.5:
                            <strong>
                              {" "}
                              {point.pm25}
                              {" "}µg/m³
                            </strong>
                          </div>

                          <span
                            className={`status-badge ${info.className}`}
                          >
                            {info.label}
                          </span>

                        </div>

                      </Popup>

                    </CircleMarker>

                  );

                }
              )}


              {/* START */}

              <Marker
                position={[
                  from.lat,
                  from.lon,
                ]}
                icon={startIcon}
              >

                <Popup>

                  <strong>
                    Starting Point
                  </strong>

                  <br />

                  {from.name}

                </Popup>

              </Marker>


              {/* DESTINATION */}

              <Marker
                position={[
                  to.lat,
                  to.lon,
                ]}
                icon={destinationIcon}
              >

                <Popup>

                  <strong>
                    Destination
                  </strong>

                  <br />

                  {to.name}

                </Popup>

              </Marker>


              {/* ROUTE */}

              {route && (

                <Polyline
                  positions={route.geometry.coordinates.map(
                    ([lon, lat]) => [
                      lat,
                      lon,
                    ]
                  )}
                  pathOptions={{
                    color: "#087f5b",
                    weight: 7,
                    opacity: 0.9,
                    lineCap: "round",
                    lineJoin: "round",
                  }}
                />

              )}


              <RouteZoom
                route={route}
              />

            </MapContainer>


            {/* MAP LEGEND */}

            <div className="map-legend">

              <div className="legend-title">
                AQI LEVEL
              </div>

              <div className="legend-item">
                <span className="legend-dot good"></span>
                Good
              </div>

              <div className="legend-item">
                <span className="legend-dot satisfactory"></span>
                Satisfactory
              </div>

              <div className="legend-item">
                <span className="legend-dot moderate"></span>
                Moderate
              </div>

              <div className="legend-item">
                <span className="legend-dot poor"></span>
                Poor
              </div>

              <div className="legend-route">
                <span></span>
                Selected Route
              </div>

            </div>

          </div>

        </section>



        {/* =============================================
            ROUTE RECOMMENDATION
        ============================================= */}

        {route && (

          <section className="recommendation-section">

            <div className="recommendation-top">

              <div className="recommendation-title">

                <div className="recommendation-icon">
                  🌿
                </div>

                <div>

                  <span>
                    ROUTE RECOMMENDATION
                  </span>

                  <h2>
                    Clean-Air Route
                  </h2>

                </div>

              </div>

              <div className="recommended-tag">
                Recommended
              </div>

            </div>


            <div className="recommendation-content">

              <div className="route-stat">

                <span>
                  DISTANCE
                </span>

                <strong>
                  {formatDistance(
                    route.distance
                  )}
                </strong>

              </div>


              <div className="route-stat">

                <span>
                  ESTIMATED TIME
                </span>

                <strong>
                  {formatTime(
                    route.duration
                  )}
                </strong>

              </div>


              <div className="route-stat">

                <span>
                  AVERAGE AQI
                </span>

                <strong>
                  {route.averageAQI}
                </strong>

              </div>

            </div>


            <div className="recommendation-message">

              <div className="message-icon">
                ✓
              </div>

              <div>

                <strong>
                  Why this route?
                </strong>

                <p>
                  This route is selected based on
                  the available environmental
                  pollution data along the route.
                  It provides a lower modeled
                  pollution exposure for the journey.
                </p>

              </div>

            </div>


            <div className="prototype-disclaimer">

              <span>ⓘ</span>

              Pollution values are prototype
              estimates based on the available
              environmental data and should not be
              considered medical advice.

            </div>

          </section>

        )}



        {/* =============================================
            FOOTER
        ============================================= */}

        <footer className="footer">

          <span>
            AeroHealth AI
          </span>

          <span>
            Environmental data • OpenStreetMap • OSRM
          </span>

        </footer>


      </main>

    </div>
  );
}

export default App;
