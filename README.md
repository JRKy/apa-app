# Antenna Pointing Angles (APA) Application

A web-based application for calculating antenna pointing angles to MUOS and other geostationary satellites.

[![Version](https://img.shields.io/badge/version-3.0-blue.svg)](https://github.com/JRKy/apa-app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/JRKy/apa-app/blob/main/LICENSE)
[![Deploy](https://github.com/JRKy/apa-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/JRKy/apa-app/actions/workflows/deploy.yml)

---

## ✨ Features

- 🌍 Interactive world map with satellite subsatellite positions  
- 🛰️ Antenna pointing angle (Az/El) calculations from any location  
- 📡 Satellite visibility indicators (elevation > 0° = in view)  
- 🔍 Location search with Nominatim integration  
- 🔄 Unit conversion (km / mi)  
- 📱 Responsive design (desktop & mobile)  
- 🌙 Dark/Light theme toggle  
- 📊 Geolocation with accuracy circle  

---

## 🚀 Live Demo

The app is deployed on **GitHub Pages**:  
👉 [https://jrky.github.io/apa-app](https://jrky.github.io/apa-app)

---

## 🛠 Tech Stack

- [React 19](https://react.dev/) + [Vite 6.3](https://vitejs.dev/)  
- [TypeScript 5.7](https://www.typescriptlang.org/)  
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management  
- [Material-UI v7](https://mui.com/) for UI components  
- [Leaflet](https://leafletjs.com/) + OpenStreetMap tiles for mapping  

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
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
npm run preview
```
The production build is output to the `dist/` directory.

---

## 📂 Available Scripts

- `npm run dev` – Start development server  
- `npm run build` – Create production build  
- `npm run preview` – Preview build locally  
- `npm run lint` – Run ESLint  

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/MyFeature`)  
3. Commit changes (`git commit -m 'Add my feature'`)  
4. Push to your branch (`git push origin feature/MyFeature`)  
5. Open a Pull Request  

---

## 📄 License

This project is licensed under the MIT License – see [LICENSE](LICENSE).

---

## 📜 Changelog

See [CHANGELOG.md](CHANGELOG.md) for details.

---

## 📦 Deployment

This app is deployed via **GitHub Actions** to **GitHub Pages**.  
- Branch: `develop` (or `main`, depending on config)  
- Workflow: `.github/workflows/deploy.yml` builds the app and publishes it to Pages.  

URL: [https://jrky.github.io/apa-app](https://jrky.github.io/apa-app)
