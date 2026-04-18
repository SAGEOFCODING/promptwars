# Eventlytics Venue App 🏟️

Eventlytics is a high-performance, mobile-first web application built to enhance the attendee experience at sporting venues. It provides real-time crowd analytics, wait time monitoring, indoor venue mapping, and live notifications.

## Architecture
- **Framework**: React 19 / Vite
- **Styling**: Vanilla CSS Modules (custom variables)
- **Icons**: `lucide-react`
- **Scalability**: Progressive Web App (PWA) ready via `vite-plugin-pwa`
- **Testing**: Vitest & React Testing Library
- **Formatting**: Prettier

## Prerequisites
- Node.js >= 18

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## Development & Maintenance

This project uses modern tooling to ensure high code quality.

### Automated Testing
To run the Vitest unit tests:
```bash
npm run test
```
To run tests in watch mode during active development:
```bash
npm run test:watch
```

### Code Formatting
This project strictly adheres to Prettier formatting rules.
```bash
npm run format
```

### Prop Validation
All UI components use `prop-types` for runtime validation. If you pass an incorrect data type to a component, a warning will appear in your browser console.
