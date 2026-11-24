// يشتغل على GitHub Actions كل ٣٠ دقيقة ويبعت الإشعارات اللي وقتها جه.
const QUOTES=["لو عرفت تعملها مرة، تقدر تعملها ألف مرة.", "الأعذار مبتبنيش عضلات.. بس أول خطوة بتبني.", "لو أنا قدرت أعدي الصعب وأوصل، إنت كمان تقدر.", "أنا بدأت لوحدي وإنت معاك الدفتر ده، يلا نكسر الدنيا.", "كل بطل بتشوفه دلوقتي بدأ بيوم واحد وتمرين واحد، الدور عليك.", "يوم واحد بس. النهارده. وبعدين نشوف.", "الإحماء هو أول انتصار، ابدأ بيه.", "ابدأ ولو بتمرين واحد.. دايمًا بتكمل أكتر مما فكرت.", "ماتستناش الحافز.. ابدأ والحافز هيلحقك.", "لو خايف تبدأ، ابدأ وإنت خايف.", "ابدأ بالصغير، الكبير بييجي لوحده.", "مفيش حد بيبدأ جاهز، الكل بيبدأ وبيتعلم.", "الشنطة جاهزة؟ يبقى نص الطريق خلص.", "خمس دقايق إحماء بس، وبعدها شوف هتكمل ولا لأ.", "مش محتاج خطة مثالية، محتاج أول مجموعة.", "النهارده تمرين عادي، والعادي ده اللي بيصنع الأبطال.", "أصعب جزء هو أول أسبوع، وبعده الطريق بيتمهّد.", "ابدأ بالمجموعة الأولى وسيب الباقي للحماس اللي هييجي.", "مش لازم يومك يبقى فاضي عشان تهتم بنفسك.. ابدأ بالوقت اللي تقدر عليه.", "بلاش تفاوض نفسك طول اليوم.. اختار معادك، ولما ييجي ابدأ.", "بدل ما تستنى مزاجك يتظبط، اعمل حاجة صغيرة تظبط بيها يومك.", "مش كل حاجة محتاجة حماس.. ساعات محتاجة قرار صغير وتنفيذه.", "خلي هدفك النهارده إنك تخلص اللي اتفقت عليه مع نفسك، حتى لو كان بسيط."];
const DAYMS=86400000;
const diff=(a,b)=>Math.round((Date.parse(a+"T00:00:00Z")-Date.parse(b+"T00:00:00Z"))/DAYMS);
// كل نوع: k=المفتاح، t=ساعة البداية (بالدقايق)، len=مدة الشباك، ok=شرط إضافي، key=مفتاح منع التكرار، body
const KINDS=[
 {k:"m",t:420, title:"☀️ أذكار الصباح", body:c=>"ما تنساش أذكار الصباح"+c.nm+"، دقيقتين وتخلّصها."},
 {k:"a",t:600, title:"👋 وحشتنا", ok:c=>c.d.last&&diff(c.date,c.d.last)>=3&&!(c.sent.a&&diff(c.date,c.sent.a)<3), body:c=>"بقالك "+diff(c.date,c.d.last)+" أيام بعيد"+c.nm+". ارجع بتمرين خفيف النهارده 💪"},
 {k:"g",t:600, title:"🏟️ اشتراك الجيم", ok:c=>{ if(!c.d.gym) return false; const l=diff(c.d.gym,c.date); c.gl=l; return l===3||l===1||l===0; }, body:c=>c.gl===0?"اشتراك الجيم بيخلص النهارده، جدّده.":"اشتراك الجيم فاضل عليه "+(c.gl===1?"يوم واحد":"٣ أيام")+"."},
 {k:"q",t:750, title:"💬 رسالة اليوم", body:c=>QUOTES[c.day%QUOTES.length]},
 {k:"w",t:990, title:"🏋️ تمرين النهارده", ok:c=>!c.restToday&&c.d.trained!==c.date, body:c=>"تمرين النهارده مستنيك"+c.nm+". ابدأ قبل ما اليوم يخلص 💪"},
 {k:"f",t:870,title:c=>c.day%2===0?"💡 هل تعرف؟":"💪 تشجيع", body:c=>c.day%2===0?TIPSF[Math.floor(c.day/2)%TIPSF.length]:ENC[Math.floor(c.day/2)%ENC.length]},
 {k:"e",t:1110,len:90,title:"🌙 أذكار المساء", body:c=>"أذكار المساء"+c.nm+"، ما تنساهاش."},
 {k:"r",t:1200,title:"⏰ لسه فيه وقت", ok:c=>!c.restToday&&c.d.trained!==c.date, body:c=>(c.d.streak>=3?"سلسلتك "+c.d.streak+" أيام 🔥 ما تكسرهاش النهارده":"لسه فيه وقت")+"، 20 دقيقة تكفي."},
 {k:"c",t:1260,title:"🎉 عاش يا بطل", ok:c=>!c.restToday&&c.d.trained===c.date, body:c=>"خلّصت تمرين النهارده"+c.nm+(c.d.streak>=2?"، وسلسلتك "+c.d.streak+" أيام 🔥":"")+". ارتاح وكُل كويس."},
 {k:"p",t:0,len:1440,title:"🏆 رقم قياسي جديد", ok:c=>c.d.pr===c.date, body:c=>"كسرت رقمك"+c.nm+"! كمّل كده 💪"},
 {k:"h",t:540,len:720,title:"🔥 شدّ حيلك", key:c=>c.date+"-"+Math.floor(c.mins/120), body:c=>QUOTES[(c.day+Math.floor(c.mins/120))%QUOTES.length]}
];
const TIPSF=["جرّبت «المجتمع» في التطبيق؟ شارك إنجازك وشجّع زمايلك 👥","فيه مصحف كامل بالتلاوة جوه التطبيق. افتح «القرآن والعبادات» 📖","افتح «الملخص» وشوف إنجازك في الأسبوع وشاركه ستوري 📊","من «المزيد» هتلاقي السجل والجسم والأكل والإعدادات. لف فيه وشوف 👀","رتّب تمرينك بنفسك: اختار تمرين كل يوم من صفحة التمرين 🗓️","سجّل وزنك وقياساتك من «الجسم» وشوف تقدمك بالأرقام 📏","عدّاد الأذكار والسلسلة في «القرآن والعبادات». كمّل سلسلتك 🔥"];
const ENC=["كل تمرين بتعمله النهارده بيفرق معاك بعد شهر. كمّل 💪","مش لازم تمرين كامل. 15 دقيقة أحسن من صفر.","الانضباط أهم من الحماس. اللي بيكمّل هو اللي بيوصل.","افتكر ليه بدأت. النهارده خطوة جديدة.","جسمك بيشكرك على كل مرة بتتحرك فيها 🙏","الأيام الصعبة هي اللي بتبني الأبطال.","ما تقارنش نفسك بحد. قارن نفسك بنفسك من أسبوع."];
const OPT_IN={h:true};
const PRAYERS=[["dhuhr","الظهر"],["asr","العصر"],["maghrib","المغرب"],["isha","العشاء"]]; // الأنواع اللي مقفولة لحد ما المستخدم يفتحها
// دالة صافية: بتقرر مين ياخد إيه دلوقتي (عشان نقدر نختبرها)
function decide(d,nowMs){
  const out=[]; if(!d||!d.tok) return out;
  const loc=new Date(nowMs+(d.off||0)*60000), date=loc.toISOString().slice(0,10), mins=loc.getUTCHours()*60+loc.getUTCMinutes(), dow=loc.getUTCDay(), sent=d.sent||{};
  const c={d,date,mins,sent,day:Math.floor(nowMs/DAYMS),nm:d.name?" يا "+String(d.name).slice(0,20):"",restToday:!!(d.rest&&d.rest[dow])};
  for(const K of KINDS){
    if(OPT_IN[K.k]?d[K.k]!==true:d[K.k]===false) continue;
    const len=K.len||120; if(mins<K.t||mins>=K.t+len) continue;
    const key=K.key?K.key(c):date; if(sent[K.k]===key) continue;
    if(K.ok&&!K.ok(c)) continue;
    out.push({k:K.k,date:key,title:typeof K.title==="function"?K.title(c):K.title,body:K.body(c)});
  }
  // تنبيه قبل الصلاة (الوقت بييجي من موبايل المستخدم في d.pt بالدقايق من نص الليل)
  if(d.s!==false && d.pt){
    for(const [id,nm] of PRAYERS){
      const t=d.pt[id]; if(typeof t!=="number") continue;
      const left=Math.round(t-mins);
      if(left>=2&&left<=14){ const k="s_"+id; if(!sent[k]||sent[k]!==date) out.push({k,date,ttl:Math.max(60,left*60),title:"🕌 استعد لصلاة "+nm,body:"باقي "+left+" دقايق على أذان "+nm+"، جهّز نفسك للصلاة."}); }
      else if(left>=-4&&left<=1){ const k="t_"+id; if(sent[k]!==date) out.push({k,date,ttl:900,title:"🕌 حان وقت صلاة "+nm,body:"حان الآن موعد صلاة "+nm+". الصلاة في وقتها أحسن 🤍"}); }
    }
  }
  return out;
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
          await admin.messaging().send({token:d.tok,data:{title:m.title,body:m.body,url:"./app.html",tag:m.k},webpush:{headers:{Urgency:"high",TTL:String(m.ttl||7200)}}});
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
