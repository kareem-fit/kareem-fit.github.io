var V="ks-v3";
var SHELL=["./","index.html","app.html","fb.js","manifest.webmanifest","icon-192.png","avatar.jpg","hero.jpg"];
self.addEventListener("install",function(e){ e.waitUntil(caches.open(V).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener("activate",function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==V; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener("fetch",function(e){
  var r=e.request; if(r.method!=="GET") return;
  var u=new URL(r.url);
  var lib=u.hostname==="www.gstatic.com"||u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com";
  if(lib){
    e.respondWith(caches.open(V).then(function(c){ return c.match(r).then(function(m){
      var f=fetch(r).then(function(res){ if(res && (res.ok||res.type==="opaque")) c.put(r,res.clone()); return res; }).catch(function(){ return m; });
      return m||f;
    }); }));
    return;
  }
  if(u.origin===location.origin){
    e.respondWith(fetch(r).then(function(res){ if(res && res.ok){ var cp=res.clone(); caches.open(V).then(function(c){ c.put(r,cp); }); } return res; }).catch(function(){ return caches.match(r).then(function(m){ return m||caches.match("app.html"); }); }));
  }
});
 
