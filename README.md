# Antenna Pointing Angles (APA) Application

A web-based application for calculating antenna pointing angles to MUOS and other geostationary satellites.

[![Version](https://img.shields.io/badge/version-3.0-blue.svg)](https://github.com/JRKy/apa-app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.1-blue.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Deploy](https://github.com/JRKy/apa-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/JRKy/apa-app/actions/workflows/deploy.yml)

---

## ✨ Features

- 🌍 Interactive world map with OpenStreetMap tiles  
- 🛰️ MUOS + other GEO satellites rendered at subsatellite points  
- 📡 Antenna pointing angle (Azimuth/Elevation) calculations from any location  
- 📊 Satellite visibility indicators (elevation > 0° = visible)  
- 🔍 Location search with autocomplete (Leaflet Search + Nominatim)  
- 🗺️ Combatant Command (CCMD) region overlays via GeoJSON  
- 🔄 Unit conversion (km / mi)  
- 📱 Responsive design for desktop & mobile  
- 🌙 Dark/Light theme support (MUI theming)  
- ⚡ Offline-capable (PWA manifest + service worker)  
- 🔗 Routing with React Router  
- 📦 State management with Redux Toolkit + React Query  

---

## 🚀 Live Demo

👉 [https://jrky.github.io/apa-app](https://jrky.github.io/apa-app)

---

## 🛠 Tech Stack

- **React 18** + **Vite 5** + **TypeScript 5.3**  
- **Redux Toolkit** + **React Query** for state & data fetching  
- **Material-UI (MUI v5)** for UI components + theming  
- **Leaflet** + **React-Leaflet** + **Leaflet-Search** for maps  
- **Axios** for data requests  
- **Lodash** for utilities  
- **React Router v6** for routing  
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
Open [http://localhost:5173](http://localhost:5173).

### Production Build
```bash
npm run build
npm run preview
```

---

## 📂 Scripts

- `npm run dev` – Start development server  
- `npm run build` – Production build to `dist/`  
- `npm run preview` – Preview the build locally  
- `npm run lint` – Run ESLint  

---

## 📦 Deployment

Deployed via **GitHub Actions** to **GitHub Pages**.  
- Workflow: `.github/workflows/deploy.yml`  
- Branch: `develop` (merged into `main` for release)  
- URL: [https://jrky.github.io/apa-app](https://jrky.github.io/apa-app)

---

## 🤝 Contributing

1. Fork repo  
2. Create branch: `git checkout -b feature/YourFeature`  
3. Commit changes: `git commit -m 'Add feature'`  
4. Push branch: `git push origin feature/YourFeature`  
5. Open Pull Request  

---

## 📄 License

MIT © [JRKy](https://github.com/JRKy)

---

## 📜 Changelog

See [CHANGELOG.md](CHANGELOG.md).
