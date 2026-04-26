# 🚀 Smart Nearby Recommender

A modern web app that recommends nearby places based on your mood using real-time location and smart ranking.

---

## ✨ Features

* 📍 Detects user location
* 🎯 Mood-based filtering (Work, Date, Quick Bite, Budget)
* ⭐ Smart ranking (rating + reviews + distance)
* 🗺️ Google Maps integration
* 🖼️ Place images using Places API
* 🎨 Modern futuristic UI
* 📱 Horizontal scrolling cards

---

## 🧠 How it Works

1. User selects a mood
2. App fetches nearby places using Google Places API
3. Places are ranked using:

   * Rating
   * Number of reviews
   * Distance from user
4. Best results are displayed in a clean UI

---

## 🛠️ Tech Stack

**Frontend**

* React.js
* CSS (custom UI)

**Backend**

* Node.js
* Express.js

**APIs**

* Google Places API
* Google Maps API

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/smart-nearby-recommender.git
cd smart-nearby-recommender
```

---

### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file:

```env
GOOGLE_API_KEY=your_api_key_here
PORT=5000
```

Run server:

```bash
node server.js
```

---

### 3. Setup Frontend

```bash
cd client
npm install
npm start
```

---

## 📌 Important

* API keys are stored securely using `.env`
* `.env` is excluded using `.gitignore`

---

## 🚀 Future Improvements

* 🔍 Search functionality
* 🎛️ Filters (rating, distance)
* ❤️ Save favorites
* 🌐 Deploy to cloud

---

## 👨‍💻 Author

Built by M.A. Tejeshwar
