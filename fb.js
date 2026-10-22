(function(){
if(typeof firebase==="undefined"){ console.warn("Firebase SDK لم يُحمَّل"); return; }
var CFG={apiKey:"AIzaSyAgCmdypGmRBK8L8C9Wt7p4-19N8Pa1JJc",authDomain:"kareem-samy.firebaseapp.com",projectId:"kareem-samy",storageBucket:"kareem-samy.firebasestorage.app",messagingSenderId:"369762299077",appId:"1:369762299077:web:d85dc8f60f0829c940d4ac"};
firebase.initializeApp(CFG);
var KS=window.KS={};
KS.ADMIN="kateemsamy51@gmail.com";
KS.fs=firebase.firestore();
KS.auth=firebase.auth ? firebase.auth() : null;
function cyrb53(str){
  var h1=0xdeadbeef,h2=0x41c6ce57;
  for(var i=0;i<str.length;i++){ var ch=str.charCodeAt(i); h1=Math.imul(h1^ch,2654435761); h2=Math.imul(h2^ch,1597334677); }
  h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);
  h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);
  return 4294967296*(2097151&h2)+(h1>>>0);
}
KS.sid=function(uid){ var s=cyrb53(uid).toString(36).toUpperCase(); while(s.length<7) s="0"+s; return "KS-"+s.slice(0,7); };
KS.cleanSrc=function(v){ v=String(v||"").toLowerCase().replace(/[^a-z0-9_-]/g,"").slice(0,30); return v||""; };
KS.src=function(){
  var p=""; try{ p=KS.cleanSrc(new URLSearchParams(location.search).get("src")); }catch(e){}
  if(p){ try{ localStorage.setItem("ks_src",p); }catch(e){} return p; }
  try{ return KS.cleanSrc(localStorage.getItem("ks_src"))||"direct"; }catch(e){ return "direct"; }
};
KS.inApp=function(){ return /Instagram|FBAN|FBAV|FB_IAB|TikTok|Snapchat|Line\/|MicroMessenger|Twitter/i.test(navigator.userAgent); };
KS.count=function(prefix){
  try{
    var s=KS.src(), key=prefix+"_"+s, fk="ks_cnt_"+key;
    if(sessionStorage.getItem(fk)) return Promise.resolve();
    sessionStorage.setItem(fk,"1");
    return KS.fs.doc("stats/"+key).set({n:firebase.firestore.FieldValue.increment(1)},{merge:true}).catch(function(){});
  }catch(e){ return Promise.resolve(); }
};
KS.signIn=function(){
  var p=new firebase.auth.GoogleAuthProvider(); p.setCustomParameters({prompt:"select_account"});
  return KS.auth.signInWithPopup(p);
};
KS.signInMsg=function(e){
  var c=e&&e.code||"";
  if(c==="auth/popup-closed-by-user"||c==="auth/cancelled-popup-request") return "";
  if(c==="auth/popup-blocked") return "المتصفح منع نافذة الدخول. اسمح بالنوافذ المنبثقة وجرّب تاني.";
  if(c==="auth/unauthorized-domain") return "الدومين ده لسه مش مسموح في إعدادات الدخول.";
  if(c==="auth/network-request-failed") return "مفيش إنترنت. جرّب تاني لما النت يرجع.";
  return "مقدرتش أسجّل دخولك. جرّب تاني، أو افتح الرابط في كروم أو سفاري.";
};
KS.copy=function(t){ try{ return navigator.clipboard.writeText(t); }catch(e){ return Promise.reject(); } };
})();
