# 🚀 Smart Nearby Recommender

A premium, modern web application that recommends the best nearby places tailored to your exact location and mood. Powered by Node.js, React, and Google Places API with smart ranking and out-of-the-box local testing capabilities.

---

## ✨ Features

* 📍 **Automated Location Detection**: Instantly detects your current coordinates, with seamless fallback for testing.
* 🎯 **Mood-Based Recommendations**: Tailored choices matching what you're up to (**Work**, **Date**, **Quick Bite**, **Budget**).
* ⭐ **Smart Ranking Engine**: Advanced sorting algorithm based on *Google rating + popularity (review count) + exact proximity distance*.
* 🗺️ **Embedded Live Maps**: Interactive map iframe showing your precise vicinity.
* 🖼️ **Dynamic Photography**: Auto-loaded place visuals and premium Unsplash fallbacks.
* 🎨 **Breathtaking Design System**: Futuristic visual design with Outfits typography, neon gradients, glassmorphic cards, and subtle micro-animations.

---

## 🛠️ Tech Stack

**Frontend**
* React.js
* Modern CSS (Custom responsive design tokens)

**Backend**
* Node.js
* Express.js
* Axios & Cors

**APIs**
* Google Places API (Nearby Search & Photo API)

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-nearby-recommender.git
cd smart-nearby-recommender
```

### 2. Configure Environment Variables
Navigate to the `server` directory and configure the backend `.env`:
```bash
cd server
```

Create a `.env` file containing:
```env
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
PORT=5000
```
> [!TIP]
> If you do not have a Google Maps API Key yet, leave the default placeholder. The application features built-in fallback mock data to allow testing out of the box!

### 3. Quick Run (Root Monorepo)

From the root directory, install everything and run:
```bash
npm run install-all
```

Then start the application backend (it automatically serves the built frontend statically if built, or you can run them concurrently):
```bash
# Builds frontend statically and starts backend server
npm run build
npm start
```

For development:
```bash
# Terminal 1: Run frontend
cd client && npm install && npm start

# Terminal 2: Run backend
cd server && npm install && npm start
```

---

## 🌐 Deployment Instructions

### Option 1: Deploy to Render / Railway / Heroku (Full-Stack Monorepo)

This repository includes a root `package.json` with scripts configured for automatic building and deployment.

1. Create a new Web Service and link this repository.
2. Set the following Build and Start commands:
   * **Build Command**: `npm run build`
   * **Start Command**: `npm start`
3. Add your environment variables in the dashboard:
   * `GOOGLE_MAPS_API_KEY` = *Your Google Maps API Key*
   * `PORT` = `5000` (Optional, dynamically detected)

The server automatically builds the React frontend statically and serves it on the same domain for smooth production usage.

---

## 👨‍💻 Author

Built by M.A. Tejeshwar
