import React, { useState } from "react";
import "./ui.css";

const moods = ["Work", "Date", "Quick Bite", "Budget"];

// Distance calculation
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
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("Location denied"),
      { enableHighAccuracy: true }
    );
  };

  const fetchPlaces = async () => {
    if (!location || !selectedMood) {
      alert("Select mood + location first");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/places?lat=${location.lat}&lng=${location.lng}&mood=${selectedMood}`
      );

      const data = await res.json();

      const scored = data.map((place) => {
        const rating = place.rating || 0;
        const totalRatings = place.user_ratings_total || 0;

        const lat2 = place.geometry.location.lat;
        const lng2 = place.geometry.location.lng;

        const distance = getDistance(
          location.lat,
          location.lng,
          lat2,
          lng2
        );

        const score =
          rating * 2 +
          Math.log(totalRatings + 1) +
          1 / (distance + 0.1);

        return { ...place, score, distance };
      });

      scored.sort((a, b) => b.score - a.score);
      setPlaces(scored);
    } catch (err) {
      alert("Error fetching places");
    }

    setLoading(false);
  };

  return (
    <div className="top-section fade-in">
      <h1 className="title fade-in">Smart Nearby Recommender</h1>

      {/* Mood */}
      <div className="mood-row">
        {moods.map((mood) => (
          <button
            key={mood}
            className="mood-btn"
            onClick={() => setSelectedMood(mood)}
            style={{
              background:
                selectedMood === mood ? "#6366f1" : "#111827",
              color:
                selectedMood === mood ? "white" : "#cbd5f5",
    border:
      selectedMood === mood
        ? "1px solid #6366f1"
        : "1px solid transparent",
  }}
>
  {mood}
</button>
        ))}
      </div>

      {/* Actions */}
      <div className="action-row">
        <button className="action-btn loc" onClick={getLocation}>
          📍 Get Location
        </button>

        <button className="action-btn find" onClick={fetchPlaces}>
          🔍 Find Places
        </button>
      </div>

      {/* Map */}
      {location && (
        <iframe
          title="map"
          width="100%"
          height="250"
          style={{ borderRadius: "12px", marginBottom: "20px" }}
          src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=13&output=embed`}
        />
      )}

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Results */}
      <div className="grid" style={{ marginTop: "40px" }}>
        {places.map((place, index) => {
          const photoRef = place.photos?.[0]?.photo_reference;

          const imageUrl = photoRef
            ? `http://localhost:5000/photo?ref=${photoRef}`
            : "https://images.unsplash.com/photo-1504674900247-0877df9cc836";

          return (
            <div key={index} className="card">
              <img src={imageUrl} alt="" className="image" />

              <div style={{ padding: "14px", textAlign: "center" }}>
                <h3 style={{ marginBottom: "8px" }}>{place.name}</h3>

                <p style={{ margin: "4px 0" }}>⭐ {place.rating || "N/A"}</p>
                <p style={{ margin: "4px 0" }}>👥 {place.user_ratings_total || 0}</p>

                <p style={{ margin: "4px 0" }}>
                  {place.opening_hours?.open_now ? "🟢 Open" : "🔴 Closed"}
                </p>

                <p style={{ margin: "4px 0" }}>
                  📍 {place.distance.toFixed(2)} km
                </p>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ 
                    display: "inline-block",
                    marginTop: "8px",
                    color: "#38bdf8",
                    fontSize: "14px"
                  }}
                >
                  Open in Maps
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;