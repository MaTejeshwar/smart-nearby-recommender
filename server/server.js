import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Fetching all variations of API key names for maximum compatibility
const API_KEY = process.env.GOOGLE_API_KEY || process.env.GOOGLE_MAPS_API_KEY || process.env.API_KEY || process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Mock data to ensure out-of-the-box functionality if the API key is missing
const getMockPlaces = (lat, lng, keyword) => [
  {
    name: `The Daily Roast Cafe (${keyword})`,
    rating: 4.8,
    user_ratings_total: 824,
    geometry: {
      location: { lat: parseFloat(lat) + 0.003, lng: parseFloat(lng) + 0.003 }
    },
    photos: [{ photo_reference: "mock1" }],
    opening_hours: { open_now: true }
  },
  {
    name: `Aura Premium Lounge & Dine`,
    rating: 4.6,
    user_ratings_total: 1201,
    geometry: {
      location: { lat: parseFloat(lat) - 0.004, lng: parseFloat(lng) + 0.005 }
    },
    photos: [{ photo_reference: "mock2" }],
    opening_hours: { open_now: true }
  },
  {
    name: `Greenview Canopy Restaurant`,
    rating: 4.5,
    user_ratings_total: 412,
    geometry: {
      location: { lat: parseFloat(lat) + 0.008, lng: parseFloat(lng) - 0.006 }
    },
    photos: [{ photo_reference: "mock3" }],
    opening_hours: { open_now: false }
  },
  {
    name: `Budget Bites & Eats`,
    rating: 4.2,
    user_ratings_total: 231,
    geometry: {
      location: { lat: parseFloat(lat) - 0.006, lng: parseFloat(lng) - 0.002 }
    },
    photos: [{ photo_reference: "mock1" }],
    opening_hours: { open_now: true }
  }
];

app.get("/places", async (req, res) => {
  const { lat, lng, mood } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing lat/lng" });
  }

  const typeMap = {
    Work: "cafe",
    Date: "restaurant",
    "Quick Bite": "restaurant",
    Budget: "restaurant",
  };

  const keyword = typeMap[mood] || "restaurant";

  // Check if API key is not configured or is using placeholder string
  if (!API_KEY || API_KEY.startsWith("YOUR_GOOGLE_MAPS_") || API_KEY === "YOUR_API_KEY") {
    console.log("Using mock data (Google Maps API Key not fully set)");
    return res.json(getMockPlaces(lat, lng, keyword));
  }

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${lat},${lng}`,
          radius: 3000,
          keyword: keyword,
          type: "restaurant",
          key: API_KEY,
        },
      }
    );

    console.log("Places fetched:", response.data.results?.length || 0);
    res.json(response.data.results || []);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch places from Google API" });
  }
});

app.get("/photo", async (req, res) => {
  const { ref } = req.query;

  if (!ref) {
    return res.status(400).send("Missing photo ref");
  }

  // Use fallback images for mock data or missing/invalid API key
  if (!API_KEY || API_KEY.startsWith("YOUR_GOOGLE_MAPS_") || API_KEY === "YOUR_API_KEY" || ref.startsWith("mock")) {
    const fallbackImages = {
      mock1: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
      mock2: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400",
      mock3: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400"
    };
    const imageUrl = fallbackImages[ref] || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400";
    
    try {
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      res.set("Content-Type", "image/jpeg");
      res.send(response.data);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error fetching fallback image");
    }
    return;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${API_KEY}`;

    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    res.set("Content-Type", "image/jpeg");
    res.send(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error fetching image");
  }
});

// Serve client React production build statically if built
const clientBuildPath = path.join(__dirname, "../client/build");
if (fs.existsSync(clientBuildPath)) {
  console.log(`Serving static production build from ${clientBuildPath}`);
  app.use(express.static(clientBuildPath));
  
  // Single page application fallback - Middleware to catch-all
  app.use((req, res, next) => {
    if (req.path.startsWith("/places") || req.path.startsWith("/photo")) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;