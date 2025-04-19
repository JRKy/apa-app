# Antenna Pointing Angle (APA) Application

A web-based application for calculating antenna pointing angles to MUOS and ALT satellites.

[![Version](https://img.shields.io/badge/version-3.0-blue.svg)](https://github.com/JRKy/apa-app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/JRKy/apa-app/blob/main/LICENSE)

## Features

- 🌍 Interactive world map with satellite positions
- 🛰️ Real-time satellite tracking
- 📡 Antenna pointing angle calculations
- 🔍 Advanced location search with autocomplete
- 🔄 Unit conversion support (km/mi)
- 📱 Responsive design
- 🌙 Dark/Light theme support
- 🗺️ Combatant Command region visualization
- 📊 Satellite visibility indicators

## Live Demo

Visit the live application at: [https://apa-app.vercel.app](https://apa-app.vercel.app)

## Tech Stack

- React 19
- TypeScript 5.7
- Vite 6.3
- Material-UI v7
- Redux Toolkit
- Leaflet for mapping
- OpenStreetMap integration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

1. Clone the repository
```bash
git clone https://github.com/JRKy/apa-app.git
cd apa-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/JRKy/apa-app/blob/main/LICENSE) file for details.

## Changelog

See [CHANGELOG.md](https://github.com/JRKy/apa-app/blob/main/CHANGELOG.md) for a list of changes and updates.

## Deployment
This application is deployed on Vercel and automatically updates when changes are pushed to the stable-ui-version branch.
