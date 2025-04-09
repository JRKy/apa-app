const CACHE_NAME = "apa-app-cache-v2.4.0";
const OFFLINE_URL = "offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "./",
        "index.html",
        // New modular CSS files
        "css/base.css?v=2.4.0",
        "css/layout.css?v=2.4.0",
        "css/components.css?v=2.4.0",
        "css/modules.css?v=2.4.0",
        "css/dark-mode.css?v=2.4.0",
        "css/animations.css?v=2.4.0",
        "css/responsive.css?v=2.4.0",
        // JavaScript files
        "js/main.js?v=2.4.0",
        "js/modules/core/config.js?v=2.4.0",
        "js/modules/core/configManager.js?v=2.4.0",
        "js/modules/core/utils.js?v=2.4.0",
        "js/modules/core/events.js?v=2.4.0",
        "js/modules/core/version.js?v=2.4.0",
        "js/modules/ui/map.js?v=2.4.0",
        "js/modules/ui/panels.js?v=2.4.0",
        "js/modules/ui/drawers.js?v=2.4.0",
        "js/modules/ui/table.js?v=2.4.0",
        "js/modules/ui/polarPlot.js?v=2.4.0",
        "js/modules/ui/tutorial.js?v=2.4.0",
        "js/modules/ui/filters.js?v=2.4.0",
        "js/modules/ui/legend.js?v=2.4.0",
        "js/modules/ui/geocoder.js?v=2.4.0",
        "js/modules/ui/locationSelector.js?v=2.4.0",
        "js/modules/ui/satelliteCoverage.js?v=2.4.0",
        "js/modules/ui/whatsNew.js?v=2.4.0",
        "js/modules/data/storage.js?v=2.4.0",
        "js/modules/data/satellites.js?v=2.4.0",
        "js/modules/data/locations.js?v=2.4.0",
        "js/modules/data/commandRegions.js?v=2.4.0",
        "js/modules/calculations/angles.js?v=2.4.0",
        "js/modules/calculations/visibility.js?v=2.4.0",
        "manifest.json",
        "icons/icon-192.png",
        "icons/icon-512.png",
        OFFLINE_URL,
      ]);
    })
  );
  console.log("Installed SW Version: v2.4.0");
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
