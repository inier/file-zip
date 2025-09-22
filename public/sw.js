const CACHE_NAME = 'file-compressor-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// 安装事件
self.addEventListener('install', event => {
  console.log('Service Worker: 安装中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: 缓存文件');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker: 缓存失败', error);
      })
  );
});

// 激活事件
self.addEventListener('activate', event => {
  console.log('Service Worker: 激活中...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: 删除旧缓存', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 拦截请求
self.addEventListener('fetch', event => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') {
    return;
  }

  // 跳过 chrome-extension 和其他非 http(s) 协议
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有响应，返回缓存
        if (response) {
          return response;
        }

        // 否则发起网络请求
        return fetch(event.request).then(response => {
          // 检查响应是否有效
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 克隆响应，因为响应流只能使用一次
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              // 缓存新的响应
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(error => {
          console.error('Service Worker: 网络请求失败', error);
          
          // 如果是页面请求且网络失败，返回离线页面
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
          
          throw error;
        });
      })
  );
});

// 处理消息
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 推送通知支持（可选）
self.addEventListener('push', event => {
  console.log('Service Worker: 收到推送消息', event);
  
  const options = {
    body: event.data ? event.data.text() : '有新的更新可用',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: '关闭',
        icon: '/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('文件压缩工具', options)
  );
});

// 处理通知点击
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: 通知被点击', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    // 打开应用
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});