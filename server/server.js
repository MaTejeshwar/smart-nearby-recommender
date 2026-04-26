import dotenv from "dotenv";
dotenv.config();
const API_KEY = process.env.GOOGLE_API_KEY;
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = 5000;

app.get("/places", async (req, res) => {
  const { lat, lng, mood } = req.query;

  const typeMap = {
    Work: "cafe",
    Date: "restaurant",
    "Quick Bite": "restaurant",
    Budget: "restaurant",
  };

  const keyword = typeMap[mood] || "restaurant";

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

    console.log("Places fetched:", response.data.results.length);

    res.json(response.data.results);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/photo", async (req, res) => {
  const { ref } = req.query;

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