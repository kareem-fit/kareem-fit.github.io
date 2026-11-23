// رسالة يدوية لكل اللي فعّلوا الإشعارات. بتتشغل من تبويب Actions.
const admin=require("firebase-admin");
admin.initializeApp({credential:admin.credential.cert(JSON.parse(process.env.FCM_KEY))});
(async()=>{
  const title=(process.env.TITLE||"دفتر تمرين").slice(0,80), body=(process.env.BODY||"").slice(0,300);
  if(!body){ console.log("no body"); process.exit(1); }
  const snap=await admin.firestore().collection("push").get(); let n=0,f=0;
  for(const doc of snap.docs){
    const d=doc.data(); if(!d.tok) continue;
    try{ await admin.messaging().send({token:d.tok,data:{title,body,url:"./app.html",tag:"bc"}}); n++; }
    catch(e){ f++; if(e.code==="messaging/registration-token-not-registered"||e.code==="messaging/invalid-registration-token") await doc.ref.set({tok:""},{merge:true}); }
  }
  console.log("sent",n,"failed",f);
})().catch(e=>{console.error(e);process.exit(1);});
