var V="ks-v53";
var SHELL=["./","index.html","app.html","fb.js","manifest.webmanifest","icon-192.png","icon-512.png","icons/apple-touch-icon-180.png","avatar.jpg","hero.jpg","home-hero.jpg","fonts/amiri-quran.woff2"];
self.addEventListener("install",function(e){ e.waitUntil(caches.open(V).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener("activate",function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==V; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener("fetch",function(e){
  var r=e.request; if(r.method!=="GET") return;
  var u=new URL(r.url);
  if(u.origin===location.origin && u.pathname.indexOf("/bio/")===0) return;
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
self.addEventListener("push",function(e){
  var j={}; try{ j=e.data?e.data.json():{}; }catch(x){}
  var d=j.data||j.notification||j||{};
  var t=d.title||"دفتر تمرين", o={body:d.body||"",icon:"icon-192.png",badge:"icon-192.png",tag:d.tag||"ks",data:{url:d.url||"./app.html"}};
  e.waitUntil(self.registration.showNotification(t,o));
});
self.addEventListener("notificationclick",function(e){
  e.notification.close();
  var u=(e.notification.data&&e.notification.data.url)||"./app.html";
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(function(l){
    for(var i=0;i<l.length;i++){ if("focus" in l[i]) return l[i].focus(); }
    return self.clients.openWindow(u);
  }));
});
