// public/sw.js

// Константы для имен кэша
const CACHE_STATIC_V1 = "news-app-static-v1";
const CACHE_DATA_V1 = "news-app-data-v1";

// Список статических ресурсов (App Shell)
const STATIC_ASSETS = ["/", "/index.html", "/bundle.js", "/style.css"];

// УСТАНОВКА (INSTALL)
self.addEventListener("install", (event) => {
  console.log("[SW] Install: Caching App Shell.");
  self.skipWaiting();

  event.waitUntil(
    caches
      .open(CACHE_STATIC_V1)
      .then((cache) => {
        console.log("[SW] Caching static assets:", STATIC_ASSETS);
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((err) => {
        console.error("[SW] Failed to cache static assets:", err);
      }),
  );
});

// АКТИВАЦИЯ (ACTIVATE)
self.addEventListener("activate", (event) => {
  console.log("[SW] Activate: Cleaning old caches.");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_STATIC_V1 && cacheName !== CACHE_DATA_V1) {
              console.log(`[SW] Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            }
            return undefined;
          }),
        );
      })
      .catch((err) => {
        console.error("[SW] Failed to clean caches:", err);
      }),
  );

  self.clients.claim();
});

// ПЕРЕХВАТ ЗАПРОСОВ (FETCH)
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Пропускаем запрос к самому Service Worker
  if (requestUrl.pathname.endsWith("/sw.js")) {
    return; // Запрос идёт в сеть, без перехвата SW
  }

  // Определяем, является ли запрос запросом к нашему API
  const isApiRequest = requestUrl.pathname === "/news";

  if (isApiRequest) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }
          return caches
            .open(CACHE_DATA_V1)
            .then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            })
            .catch((err) => {
              console.error("[SW] Failed to cache API response:", err);
              return networkResponse;
            });
        })
        .catch(async () => {
          console.log("[SW] Network failed. Serving data from data cache.");
          const cachedResponse = await caches.match(event.request);

          if (cachedResponse) {
            return cachedResponse;
          }

          return new Response(
            JSON.stringify({
              status: "error",
              message: "Offline and no cached data available.",
            }),
            {
              headers: { "Content-Type": "application/json" },
              status: 503,
            },
          );
        }),
    );
    return;
  }

  // Статические ресурсы (Cache First, then Network)
  const isStaticAsset =
    STATIC_ASSETS.includes(requestUrl.pathname) ||
    event.request.destination === "style" ||
    event.request.destination === "script" ||
    event.request.destination === "image";

  if (isStaticAsset) {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
        .catch((err) => {
          console.error("[SW] Failed to handle static asset:", err);
          return fetch(event.request);
        }),
    );
    return;
  }

  // Остальные запросы: Network Only
  event.respondWith(fetch(event.request));
});
