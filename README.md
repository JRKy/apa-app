# Antenna Pointing Angles (APA) Application

A web-based application for calculating antenna pointing angles to MUOS and other geostationary satellites.

[![Version](https://img.shields.io/badge/version-3.0-blue.svg)](https://github.com/JRKy/apa-app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-blue.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Deploy](https://github.com/JRKy/apa-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/JRKy/apa-app/actions/workflows/deploy.yml)

---

## ✨ Features

- 🌍 Interactive world map with OpenStreetMap tiles (Leaflet)
- 🛰️ MUOS + other GEO satellites rendered at subsatellite points
- 📡 Antenna pointing angle (Azimuth/Elevation) calculations from any location
- 📊 Satellite visibility indicators (elevation > 0° = visible)
- 🔍 Location search with autocomplete (Leaflet Search + Nominatim)
- 🔄 Unit conversion (km / mi)
- 📱 Responsive design for desktop & mobile
- 🌙 Dark/Light theme support (MUI theming)
- ⚡ Offline-capable shell (PWA manifest + service worker)
- 🔗 Routing with React Router
- 📦 State management with Redux Toolkit + React Query

> Note: CCMD overlays are **not** included in the current codebase. If added later via GeoJSON, we can document the layer and usage here.

---

## 🚀 Live Demo

Deployed on **GitHub Pages**:  
👉 https://jrky.github.io/apa-app

---

## 🛠 Tech Stack

- **React 18** + **Vite 5** + **TypeScript 5.3**
- **Redux Toolkit** + **React Query**
- **Material-UI (MUI v5)** + Emotion
- **Leaflet** + **React-Leaflet** + **Leaflet-Search**
- **Axios**, **Lodash**
- **React Router v6**
- **PWA**: manifest + service worker

---

## ⚡ Getting Started

### Prerequisites
- Node.js **18+**
- npm **9+**

### Installation
```bash
git clone https://github.com/JRKy/apa-app.git
cd apa-app
npm install
```

### Development
```bash
npm run dev
```
Open http://localhost:5173

### Production Build
```bash
npm run build
npm run preview
```
Build output is in `dist/`.

---

## 📂 Scripts

- `npm run dev` – Start development server
- `npm run build` – Production build to `dist/`
- `npm run preview` – Preview the production build locally
- `npm run lint` – Run ESLint

---

## 📦 Deployment (GitHub Pages)

This repository deploys via **GitHub Actions** to **GitHub Pages**.
- Workflow: `.github/workflows/deploy.yml` (builds with Vite, publishes `dist/`)
- SPA fallback: copies `dist/index.html` to `dist/404.html`
- Vite config: make sure `vite.config.ts` includes:
  ```ts
  export default defineConfig({
    plugins: [react()],
    base: '/apa-app/',
  })
  ```

Live URL: https://jrky.github.io/apa-app

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m "feat: add YourFeature"`
4. Push the branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## 📄 License

MIT © 2025 JRKy — see [LICENSE](LICENSE).

---

## 📜 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a history of changes.
