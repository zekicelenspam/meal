const V='meal-v3';
const SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png','icon-180.png','maskable-512.png','meta.json'];
const DATA=['diyanet.json','elmalili.json','ates.json','bulac.json','ar.json','okunus.json'];
// Kurulum sadece küçük dosyaları bekler, böylece uygulama hemen yüklenebilir olur
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
  // Mealleri arka planda indir (çevrimdışı okuma için)
  caches.open(V).then(c=>Promise.all(DATA.map(u=>c.match(u).then(m=>m||c.add(u).catch(()=>{})))));
});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===location.origin&&(u.pathname.endsWith('/')||u.pathname.endsWith('index.html'))){
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})));
});
