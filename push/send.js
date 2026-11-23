// يشتغل على GitHub Actions كل ٣٠ دقيقة ويبعت الإشعارات اللي وقتها جه.
const KINDS=[
 {k:"m",h:7,  title:"☀️ أذكار الصباح",  body:n=>"ما تنساش أذكار الصباح"+n+"، دقيقتين وتخلّصها."},
 {k:"q",h:12.5,title:"💬 رسالة اليوم",   body:(n,day)=>QUOTES[day%QUOTES.length]},
 {k:"w",h:16.5,title:"🏋️ هتنزل الجيم إمتى؟",body:n=>"تمرين النهارده مستنيك"+n+". ابدأ قبل ما اليوم يخلص 💪"},
 {k:"e",h:18.5,title:"🌙 أذكار المساء",  body:n=>"أذكار المساء"+n+"، ما تنساهاش."}
];
const QUOTES=["لو عرفت تعملها مرة، تقدر تعملها ألف مرة.", "الأعذار مبتبنيش عضلات.. بس أول خطوة بتبني.", "لو أنا قدرت أعدي الصعب وأوصل، إنت كمان تقدر.", "أنا بدأت لوحدي وإنت معاك الدفتر ده، يلا نكسر الدنيا.", "كل بطل بتشوفه دلوقتي بدأ بيوم واحد وتمرين واحد، الدور عليك.", "يوم واحد بس. النهارده. وبعدين نشوف.", "الإحماء هو أول انتصار، ابدأ بيه.", "ابدأ ولو بتمرين واحد.. دايمًا بتكمل أكتر مما فكرت.", "ماتستناش الحافز.. ابدأ والحافز هيلحقك.", "لو خايف تبدأ، ابدأ وإنت خايف.", "ابدأ بالصغير، الكبير بييجي لوحده.", "مفيش حد بيبدأ جاهز، الكل بيبدأ وبيتعلم.", "الشنطة جاهزة؟ يبقى نص الطريق خلص.", "خمس دقايق إحماء بس، وبعدها شوف هتكمل ولا لأ.", "مش محتاج خطة مثالية، محتاج أول مجموعة.", "النهارده تمرين عادي، والعادي ده اللي بيصنع الأبطال.", "أصعب جزء هو أول أسبوع، وبعده الطريق بيتمهّد.", "ابدأ بالمجموعة الأولى وسيب الباقي للحماس اللي هييجي.", "مش لازم يومك يبقى فاضي عشان تهتم بنفسك.. ابدأ بالوقت اللي تقدر عليه.", "بلاش تفاوض نفسك طول اليوم.. اختار معادك، ولما ييجي ابدأ.", "بدل ما تستنى مزاجك يتظبط، اعمل حاجة صغيرة تظبط بيها يومك.", "مش كل حاجة محتاجة حماس.. ساعات محتاجة قرار صغير وتنفيذه.", "خلي هدفك النهارده إنك تخلص اللي اتفقت عليه مع نفسك، حتى لو كان بسيط."];
// دالة صافية: بتقرر مين ياخد إيه دلوقتي (عشان نقدر نختبرها)
function decide(d,nowMs){
  const out=[]; if(!d||!d.tok) return out;
  const loc=new Date(nowMs+(d.off||0)*60000), date=loc.toISOString().slice(0,10), mins=loc.getUTCHours()*60+loc.getUTCMinutes(), dow=loc.getUTCDay(), sent=d.sent||{};
  const day=Math.floor(nowMs/86400000), nm=d.name?" يا "+String(d.name).slice(0,20):"";
  for(const K of KINDS){
    if(!d[K.k]) continue; const t=K.h*60; if(mins<t||mins>=t+120) continue; if(sent[K.k]===date) continue;
    if(K.k==="w"){ if(d.rest&&d.rest[dow]) continue; if(d.trained===date) continue; }
    out.push({k:K.k,date,title:K.title,body:K.body(nm,day)});
  } return out;
}
module.exports={decide};
if(require.main===module){
  const admin=require("firebase-admin");
  admin.initializeApp({credential:admin.credential.cert(JSON.parse(process.env.FCM_KEY))});
  const db=admin.firestore();
  (async()=>{
    const snap=await db.collection("push").get(); let sentN=0;
    for(const doc of snap.docs){
      const d=doc.data(), list=decide(d,Date.now());
      for(const m of list){
        try{
          await admin.messaging().send({token:d.tok,data:{title:m.title,body:m.body,url:"./app.html",tag:m.k},webpush:{headers:{Urgency:"high",TTL:"7200"}}});
          await doc.ref.set({sent:{[m.k]:m.date}},{merge:true}); sentN++;
        }catch(e){
          console.log("fail",doc.id,m.k,e.code||e.message);
          if(e.code==="messaging/registration-token-not-registered"||e.code==="messaging/invalid-registration-token") await doc.ref.set({tok:""},{merge:true});
        }
      }
    }
    console.log("done, sent:",sentN,"users:",snap.size);
  })().catch(e=>{ console.error(e); process.exit(1); });
}
