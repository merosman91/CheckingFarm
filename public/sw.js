// service-worker.js
const CACHE_NAME = 'douajny-v2.0.0';
const APP_STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512.png',
  '/icon-192.png',
  '/icon-144.png'
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(APP_STATIC_RESOURCES);
    })()
  );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});

// استراتيجية التخزين: Network First مع fallback إلى Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      try {
        // محاولة جلب المورد من الشبكة أولاً
        const networkResponse = await fetch(event.request);
        
        // تخزين النسخة المحدثة في الكاش
        if (event.request.method === 'GET') {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (error) {
        // إذا فشل الاتصال، استرجاع من الكاش
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // للصفحات، عرض صفحة عدم الاتصال
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        
        return new Response('Network error happened', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    })()
  );
});

// التعامل مع الرسائل من التطبيق
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// متزامنة البيانات في الخلفية
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-daily-records') {
    event.waitUntil(syncDailyRecords());
  }
});

async function syncDailyRecords() {
  // دالة لمزامنة السجلات اليومية
  const db = await openDatabase();
  const records = await db.getAll('dailyRecords');
  
  for (const record of records) {
    if (!record.synced) {
      try {
        await fetch('/api/daily-records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });
        record.synced = true;
        await db.put('dailyRecords', record);
      } catch (error) {
        console.error('فشل مزامنة السجل:', error);
      }
    }
  }
}

// فتح قاعدة البيانات
async function openDatabase() {
  // تنفيذ بسيط لقاعدة بيانات IndexedDB
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('DouajnyDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // إنشاء مخازن البيانات
      if (!db.objectStoreNames.contains('cycles')) {
        const cyclesStore = db.createObjectStore('cycles', { keyPath: 'id' });
        cyclesStore.createIndex('status', 'status');
      }
      
      if (!db.objectStoreNames.contains('dailyRecords')) {
        const recordsStore = db.createObjectStore('dailyRecords', { keyPath: 'id' });
        recordsStore.createIndex('date', 'date');
        recordsStore.createIndex('cycleId', 'cycleId');
      }
      
      if (!db.objectStoreNames.contains('inventory')) {
        const inventoryStore = db.createObjectStore('inventory', { keyPath: 'id' });
        inventoryStore.createIndex('type', 'type');
      }
    };
  });
}

// تنبيهات Push
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open',
        title: 'فتح التطبيق'
      },
      {
        action: 'close',
        title: 'إغلاق'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// التعامل مع نقرات التنبيهات
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});
