self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url;
  if (url) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
        for (let client of windowClients) {
          if (client.url === url && 'focus' in client) {
            client.postMessage({ url }); // 既に開いている場合にメッセージ送信
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url); // 新しいタブで開く
        }
      })
    );
  }
});

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
