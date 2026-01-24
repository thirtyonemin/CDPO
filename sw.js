const CACHE_NAME = 'cdpo-calendar-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './data.json'
];

// 설치 (기본 파일 캐싱)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 데이터 요청 처리 (항상 네트워크 먼저 시도 -> 실패하면 캐시)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 네트워크에서 잘 가져왔으면, 다음을 위해 캐시도 업데이트 해둠
        if (event.request.method === 'GET' && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 인터넷 안되면 저장된 거 보여줌
        return caches.match(event.request);
      })
  );
});
