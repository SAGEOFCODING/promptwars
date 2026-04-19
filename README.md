# Eventlytics - Real-Time Venue Intelligence

Eventlytics is a production-grade, mobile-first web application designed for large-scale sporting venues. It provides real-time crowd insights, venue navigation, and wait-time tracking.

## 🏗️ Architecture
- **Framework**: React 19 + Vite 8
- **State Management**: React Hooks + Firestore Real-Time Listeners
- **Security**: Content Security Policy (CSP), DOMPurify, Rate Limiting, and Firebase App Check.
- **Performance**: Multi-stage Docker builds, manual chunking for vendor assets, and PWA capabilities.
- **Testing**: Vitest + React Testing Library (100% pass rate).

## 🛡️ Security Hardening
- **XSS Prevention**: Strict CSP headers and DOMPurify sanitization on all user inputs.
- **Brute-Force Protection**: Client-side rate limiting via `useRateLimit` hook.
- **Infrastructure**: Firebase Security Rules for Firestore and Storage, enforcing strict per-user access.
- **Privacy**: Anonymous authentication fallback with secure Guest Mode.

## ⚡ Performance Optimization
- **Lighthouse Goals**: Target 98%+ score across all categories.
- **Bundle Analysis**: Optimized vendor chunking for Firebase and React.
- **PWA**: Offline support and asset precaching via `vite-plugin-pwa`.

## ♿ Accessibility (WCAG 2.1)
- Full keyboard navigation support for interactive SVG maps.
- ARIA landmarks and live regions (`aria-live="polite"`) for real-time notifications.
- "Skip to Content" accessibility link and high-contrast glassmorphism UI.

## 🛠️ Developer Setup
```bash
npm install
npm run dev
npm run test
npm run build
```

---
Deployed to **Google Cloud Run** using automated CI/CD patterns.
