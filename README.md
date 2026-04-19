# Eventlytics | Real-Time Venue Intelligence

Eventlytics is a high-performance, mobile-first venue management application designed for large-scale stadiums and events. It leverages a modern, hardened tech stack to provide real-time crowd insights, wait times, and emergency navigation.

## 🏛️ Architecture & Engineering Standards

### ⚛️ Atomic Design Pattern
The component library follows the **Atomic Design** methodology to ensure maximum scalability and reusability:
- **Atoms**: Fundamental UI elements (Buttons, Icons).
- **Molecules**: Compound components (Queue Cards, Input Groups).
- **Organisms**: Complex feature blocks (Venue Map, Notification Feed).
- **Templates**: Page-level layout structures.

### 🎣 Logic Decoupling (Custom Hooks)
Business logic is strictly decoupled from the UI layer via **Custom React Hooks**. This ensures that components remain pure and the data synchronization logic is independently testable.
- `useVenueData`: Real-time zone synchronization.
- `useAuthSession`: Global authentication state.
- `useNotifications`: Security and info alert streaming.

### 🛡️ Defensive Engineering
- **Security**: Strict Content Security Policy (CSP), DOM sanitization (DOMPurify), and client-side rate limiting.
- **Stability**: Global unhandled exception listeners and production-grade Error Boundaries.
- **Telemetry**: Abstracted Firebase Performance and Analytics tracking.

## 🚀 Deployment
Deployed on **Google Cloud Run** with an automated containerized pipeline and NGINX security hardening.
