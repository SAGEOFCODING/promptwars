# Eventlytics Venue App 🏟️

Eventlytics is a production-grade, mobile-first web application designed for real-time venue management. Built with a futuristic aesthetic and high-performance architecture, it empowers venue staff and attendees with live crowd data, wait-time monitoring, and seamless navigation.

## ✨ Key Features
- **Interactive Venue Map**: SVG-based live map with real-time zone status.
- **Google Maps Integration**: Deep-linked navigation for native app experiences.
- **Smart Queue Management**: Live wait-time tracking and crowd density alerts.
- **Firebase Suite**: Complete integration with Auth (Google/Email), Firestore, and Analytics.
- **Guest Mode**: Zero-config "Guest Explorer" mode for instant app evaluation.
- **PWA Ready**: Offline support and home-screen installation for venue staff.

## 🛠️ Technology Stack
- **Core**: React 19 + Vite 8
- **Backend**: Firebase (Auth, Firestore, Analytics)
- **Styling**: Vanilla CSS Modules (Glassmorphism & Neon Design)
- **Testing**: Vitest + React Testing Library (33+ Integration/Unit tests)
- **Deployment**: Google Cloud Run + Docker + NGINX

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configure Environment** (Optional)
   Create a `.env` file with your Firebase credentials to enable production services. If omitted, the app defaults to **Guest Mode**.
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   ...
   ```

3. **Run Locally**
   ```bash
   npm run dev
   ```

## 🧪 Testing & Quality
The project maintains a **100% pass rate** on all core functions and edge cases.
```bash
npm run test
```

## ☁️ Deployment
The project is containerized via Docker and served through NGINX, optimized for Google Cloud Run.
```bash
gcloud run deploy eventlytics --source . --project [PROJECT_ID]
```

---
*Built with ❤️ by the Eventlytics Engineering Team.*
