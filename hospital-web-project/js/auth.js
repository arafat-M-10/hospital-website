const msg=(t,bad)=>{$('#err').textContent=t||'';$('#err').style.color=bad?'var(--bad)':'var(--ok)'};
async function startSession(s){
const r=await sb.from('profiles').select('*').eq('id',s.user.id).single();
if(r.error){msg('প্রোফাইল পাওয়া যায়নি। schema.sql ঠিকমতো Run হয়েছে কিনা দেখুন।',1);return}
const pr=r.data;role=pr.role;const u={n:pr.name||s.user.email,did:pr.doctor_id,guest:!!s.user.is_anonymous};
if(role=='patient'){let p=(await sb.from('patients').select('*').eq('user_id',s.user.id).maybeSingle()).data;
if(!p){const i=await sb.from('patients').insert({name:u.n,age:0,user_id:s.user.id}).select().single();if(i.error){msg(i.error.message,1);return}p=i.data}u.pid=p.id}
await loadAll();enter(u)}
function enter(u){me=u;tab=0;pend=null;msg('');$('#login').style.display='none';$('#app').style.display='grid';$('#hd').textContent='সেবা হাসপাতাল';$('#who').textContent=`${u.n} · ${RN[role]}`;
$('#nav').innerHTML=NAV[role].map((t,i)=>`<button data-t="${i}">${t}</button>`).join('');
$('#chips').innerHTML=CHIPS[role].map(c=>`<button>${c}</button>`).join('');$('#log').innerHTML='';
say('a',role=='admin'?'আসসালামু আলাইকুম। আমি পুরো হাসপাতালের তথ্য ও কাজ সামলাতে পারি। কী করতে হবে বলুন।':role=='doctor'?'স্বাগতম ডাক্তার। আপনার রোগী ও আয়ের তথ্য জানতে চাইলে বলুন।':role=='staff'?'স্বাগতম। অ্যাপয়েন্টমেন্ট, রোগী ভর্তি ও বেডের তথ্যে সাহায্য করতে পারি।':'স্বাগতম। ডাক্তার, বেড, ওষুধের তথ্য জানতে বা অ্যাপয়েন্টমেন্ট নিতে বলুন।');view()}
const creds=()=>({email:$('#u').value.trim(),password:$('#p').value});
$('#go').onclick=async()=>{const {data,error}=await sb.auth.signInWithPassword(creds());if(error)return msg('লগইন হয়নি: '+error.message,1);startSession(data.session)};
$('#reg').onclick=async()=>{const c=creds();const {data,error}=await sb.auth.signUp({...c,options:{data:{name:c.email.split('@')[0]}}});if(error)return msg(error.message,1);
if(data.session)startSession(data.session);else msg('ইমেইলে কনফার্মেশন লিংক গেছে, কনফার্ম করে লগইন করুন।')};
$('#gst').onclick=async()=>{const {data,error}=await sb.auth.signInAnonymously();if(error)return msg('গেস্ট লগইন হয়নি: '+error.message+' (Supabase Auth এ Anonymous sign-ins চালু করুন)',1);startSession(data.session)};
$('#p').onkeydown=e=>{if(e.key=='Enter')$('#go').click()};
$('#nav').onclick=e=>{if(e.target.dataset.t!=null){tab=+e.target.dataset.t;view()}};
$('#out').onclick=async()=>{speechSynthesis.cancel();await sb.auth.signOut();me=null;$('#app').style.display='none';$('#login').style.display='grid';$('#p').value=''};
async function boot(){if(!cfgOk){msg('js/config.js এ Supabase URL আর anon key বসান।',1);return}
const {data}=await sb.auth.getSession();if(data.session)startSession(data.session)}
