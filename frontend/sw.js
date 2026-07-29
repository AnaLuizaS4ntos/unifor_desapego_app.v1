// Service Worker simples: só para liberar o botão de instalar o PWA
self.addEventListener('install', () => {
  console.log('[Service Worker] Instalado com sucesso no UniDesapego!');
  self.skipWaiting();
});

self.addEventListener('fetch', () => {
  // Não bloqueia nada, deixa a internet funcionar normalmente
});