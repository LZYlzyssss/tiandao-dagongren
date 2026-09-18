/* ================= 天道打工人 · Service Worker =================
   策略：
   - 图片(img/)：缓存优先 + 永久落盘（同名不改动），二次访问本地秒开，绕过 Pages 的 10 分钟缓存限制
   - 同源 JS/CSS：Stale-While-Revalidate（先秒开旧档，后台拉新版，下次生效）
   - Pixi/Google 字体 CDN：可缓存即缓存（opaque 跨域响应也落盘）
   - 页面(HTML)：网络优先，断网回退本地壳
   - 仅缓存 GET 且成功(含 opaque)的响应，404 绝不落盘
   发版改下方 VERSION 即自动清旧桶 */
const VERSION='xw-v1';
const RT='xw-runtime-'+VERSION;
const CORE=[
  './','./index.html','./style.css',
  './js/data.js','./js/lore.js','./js/asset.js','./js/fx.js','./js/state.js',
  './js/battle.js','./js/minigames.js','./js/ui.js','./js/guide.js','./js/main.js',
  './img/p_r0.jpg',
];

self.addEventListener('install', e=>{
  e.waitUntil((async()=>{
    const cache=await caches.open(RT);
    /* 逐个缓存，任一失败不阻塞安装 */
    await Promise.all(CORE.map(u=>cache.add(u).catch(()=>{})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e=>{
  e.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==RT).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

const cacheable=res=>!!res && (res.ok || res.type==='opaque');

/* 图片/固定版本 CDN：缓存优先 */
async function cacheFirst(req){
  const cache=await caches.open(RT);
  const hit=await cache.match(req);
  if(hit) return hit;
  const res=await fetch(req);
  if(cacheable(res)) cache.put(req,res.clone());
  return res;
}

/* 代码/样式：先给旧档秒开，后台静默更新 */
async function staleWhileRevalidate(req){
  const cache=await caches.open(RT);
  const hit=await cache.match(req);
  const net=fetch(req).then(res=>{
    if(cacheable(res)) cache.put(req,res.clone());
    return res;
  }).catch(()=>null);
  return hit || (await net) || new Response('',{status:504});
}

/* 页面：网络优先，断网回退壳 */
async function networkFirst(req){
  const cache=await caches.open(RT);
  try{
    const res=await fetch(req);
    if(cacheable(res)) cache.put(req,res.clone());
    return res;
  }catch(_){
    const hit=await cache.match(req) || await cache.match('./');
    return hit || new Response('离线且无缓存',{status:503});
  }
}

self.addEventListener('fetch', e=>{
  const req=e.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  let p=null;
  if(url.origin===location.origin){
    if(/\/img\//.test(url.pathname)) p=cacheFirst(req);
    else if(/\.(js|css)(\?|$)/.test(url.pathname)) p=staleWhileRevalidate(req);
    else if(req.mode==='navigate'||req.destination==='document') p=networkFirst(req);
  }else if(/cdn\.jsdelivr\.net|fonts\.gstatic\.com/.test(url.hostname)){
    p=cacheFirst(req);
  }else if(/fonts\.googleapis\.com/.test(url.hostname)){
    p=staleWhileRevalidate(req);
  }
  if(p) e.respondWith(p.catch(()=>fetch(req)));
});
