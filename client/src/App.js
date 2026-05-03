import React, { useState } from "react";
import "./ui.css";

const moods = ["Work", "Date", "Quick Bite", "Budget"];

// Calculate API base URL dynamically based on environment
const API_BASE = process.env.REACT_APP_API_URL || 
  (window.location.hostname === "localhost" ? "http://localhost:5000" : "");

// Distance calculation formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function App() {
  const [selectedMood, setSelectedMood] = useState("");
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    // If running locally without HTTPS or user-denied, set a nice default location (e.g. San Francisco or New York)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        alert("Location denied or unavailable. Using default location (San Francisco) for demonstration.");
        setLocation({
          lat: 37.7749,
          lng: -122.4194,
        });
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const fetchPlaces = async () => {
    if (!location) {
      alert("Please get your location first");
      return;
    }
    if (!selectedMood) {
      alert("Please select a mood first");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/places?lat=${location.lat}&lng=${location.lng}&mood=${encodeURIComponent(selectedMood)}`
      );

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        setLoading(false);
        return;
      }

      if (!Array.isArray(data)) {
        alert("Received invalid response from server");
        setLoading(false);
        return;
      }

      const scored = data.map((place) => {
        const rating = place.rating || 0;
        const totalRatings = place.user_ratings_total || 0;

        const lat2 = place.geometry?.location?.lat || location.lat;
        const lng2 = place.geometry?.location?.lng || location.lng;

        const distance = getDistance(
          location.lat,
          location.lng,
          lat2,
          lng2
        );

        // Scoring algorithm: Rating * 2 + Weight of total reviews + distance proximity weight
        const score =
          rating * 2 +
          Math.log(totalRatings + 1) +
          1 / (distance + 0.1);

        return { ...place, score, distance };
      });

      scored.sort((a, b) => b.score - a.score);
      setPlaces(scored);
    } catch (err) {
      console.error(err);
      alert("Error fetching places. Please check if backend server is running.");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="top-section fade-in">
        <h1 className="title">Smart Nearby Recommender</h1>
        <p className="subtitle">Discover the best places tailored to your exact location and mood</p>

        {/* Mood Choices */}
        <div className="mood-row">
          {moods.map((mood) => (
            <button
              key={mood}
              className="mood-btn"
              onClick={() => setSelectedMood(mood)}
              style={{
                background: selectedMood === mood ? "#6366f1" : "#1e293b",
                color: selectedMood === mood ? "#ffffff" : "#cbd5e1",
                border: selectedMood === mood ? "1px solid #818cf8" : "1px solid rgba(255, 255, 255, 0.05)",
                boxShadow: selectedMood === mood ? "0 4px 12px rgba(99, 102, 241, 0.4)" : "none",
              }}
            >
              {mood}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="action-row">
          <button className="action-btn loc" onClick={getLocation}>
            📍 {location ? "Location Selected" : "Get Location"}
          </button>

          <button className="action-btn find" onClick={fetchPlaces}>
            🔍 Find Recommendations
          </button>
        </div>
      </div>

      {/* Embedded Map Section */}
      {location && (
        <div className="map-wrapper fade-in">
          <iframe
            title="map"
            width="100%"
            height="320"
            style={{ borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
            src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=14&output=embed`}
          />
        </div>
      )}

      {/* Dynamic Loading Spinner */}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Scanning the best matches for you...</p>
        </div>
      )}

      {/* Grid of Recommended Results */}
      {!loading && places.length > 0 && (
        <div className="grid fade-in">
          {places.map((place, index) => {
            const photoRef = place.photos?.[0]?.photo_reference;

            const imageUrl = photoRef
              ? `${API_BASE}/photo?ref=${photoRef}`
              : "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600";

            return (
              <div key={index} className="card">
                <div className="card-image-wrapper">
                  <img src={imageUrl} alt={place.name || "Place image"} className="image" />
                  <span className="badge-score">Rank #{index + 1}</span>
                </div>

                <div className="card-content">
                  <h3 className="place-title">{place.name}</h3>

                  <div className="meta-stats">
                    <span className="stat-item">⭐ {place.rating || "N/A"}</span>
                    <span className="stat-item">👥 {place.user_ratings_total || 0}</span>
                  </div>

                  <div className="status-distance">
                    <span className={place.opening_hours?.open_now ? "open-badge open" : "open-badge closed"}>
                      {place.opening_hours?.open_now ? "🟢 Open Now" : "🔴 Closed"}
                    </span>
                    <span className="dist-text">📍 {place.distance.toFixed(2)} km</span>
                  </div>

                  {place.vicinity && (
                    <p className="vicinity-text">{place.vicinity}</p>
                  )}

                  {place.geometry?.location && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="maps-link"
                    >
                      Show On Google Maps →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;