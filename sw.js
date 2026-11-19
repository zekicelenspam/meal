const V='meal-v1';
const CORE=['./','index.html','manifest.json','icons/icon-192.png','icons/icon-512.png','icons/icon-180.png',
 'data/meta.json','data/diyanet.json','data/elmalili.json','data/ates.json','data/bulac.json','data/ar.json','data/okunus.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===location.origin&&(u.pathname.endsWith('/')||u.pathname.endsWith('index.html'))){
    // sayfa: önce ağ (güncelleme için), yoksa önbellek
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));return;
  }
  // veri, ikon, yazı tipi: önce önbellek
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})));
});
