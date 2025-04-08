const CACHE_NAME = "apa-app-cache-v2.5.0";
const OFFLINE_URL = "offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "./",
        "index.html",
        // New modular CSS files
        "css/base.css?v=2.5.0",
        "css/layout.css?v=2.5.0",
        "css/components.css?v=2.5.0",
        "css/modules.css?v=2.5.0",
        "css/dark-mode.css?v=2.5.0",
        "css/animations.css?v=2.5.0",
        "css/responsive.css?v=2.5.0",
        // JavaScript files
        "data.js?v=2.5.0",
        "js/main.js?v=2.5.0",
        "js/modules/core/config.js",
        "js/modules/core/configManager.js",
        "js/modules/core/utils.js",
        "js/modules/core/events.js",
        "js/modules/core/version.js",
        "js/modules/ui/map.js",
        "js/modules/ui/panels.js",
        "js/modules/ui/drawers.js",
        "js/modules/ui/table.js",
        "js/modules/ui/polarPlot.js",
        "js/modules/ui/tutorial.js",
        "js/modules/ui/filters.js",
        "js/modules/ui/legend.js",
        "js/modules/ui/geocoder.js",
        "js/modules/ui/locationSelector.js",
        "js/modules/ui/satelliteCoverage.js",
        "js/modules/ui/whatsNew.js",
        "js/modules/data/storage.js",
        "js/modules/data/satellites.js",
        "js/modules/data/locations.js",
        "js/modules/data/commandRegions.js",
        "js/modules/calculations/angles.js",
        "js/modules/calculations/visibility.js",
        "manifest.json",
        "icons/icon-192.png",
        "icons/icon-512.png",
        OFFLINE_URL,
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request)
        .then((response) => response || caches.match(OFFLINE_URL))
      )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(keyList.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
});
