const $=s=>document.querySelector(s);
const cfgOk=typeof SUPABASE_URL=='string'&&SUPABASE_URL.startsWith('https://')&&!!SUPABASE_ANON_KEY&&!SUPABASE_ANON_KEY.startsWith('YOUR');
const sb=cfgOk?window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
const D={docs:[],pts:[],apts:[],wards:[],meds:[],bills:[]};
const RN={admin:'অ্যাডমিন',doctor:'ডাক্তার',staff:'স্টাফ',patient:'রোগী / গেস্ট'};
const NAV={admin:['ওভারভিউ','ডাক্তার','রোগী','অ্যাপয়েন্টমেন্ট','ওয়ার্ড','ফার্মেসি','আয়'],doctor:['আমার প্রোফাইল','আমার রোগী'],staff:['অ্যাপয়েন্টমেন্ট','রোগী','ওয়ার্ড','ফার্মেসি'],patient:['ডাক্তার','ওয়ার্ড','আমার অ্যাপয়েন্টমেন্ট']};
const CHIPS={admin:['আজকের আয় কত','নতুন রোগী Hasan বয়স 30','ওয়ার্ডে কয়টা বেড খালি','কম স্টকের ওষুধ'],doctor:['আমার কয়জন রোগী','আমার ভিজিট থেকে আয়','আজকের সিরিয়াল'],staff:['হৃদরোগের ডাক্তার','Karim এর জন্য Dr. Kamal এর অ্যাপয়েন্টমেন্ট','ওয়ার্ড বেড'],patient:['কোন কোন ডাক্তার আছেন','শিশু ডাক্তারের অ্যাপয়েন্টমেন্ট দাও','ICU তে বেড আছে?']};
let role='patient',me=null,tab=0,pend=null,fromVoice=false;
const doc=i=>D.docs.find(d=>d.id==i),pt=i=>D.pts.find(p=>p.id==i);
const day=o=>{const d=new Date();d.setDate(d.getDate()+o);return d.toISOString().slice(0,10)};
const money=n=>'৳'+n.toLocaleString('en-US');
const tbl=(h,rows)=>`<div class="tw"><table><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')||'<tr><td>কিছু নেই</td></tr>'}</table></div>`;
const tag=s=>`<span class="tag ${s=='CANCELLED'?'c':s=='COMPLETED'?'d':''}">${s}</span>`;
const stat=(a,b)=>`<div class="stat"><b>${a}</b><span>${b}</span></div>`;
const income=()=>D.bills.reduce((s,b)=>s+b.paid,0),due=()=>D.bills.reduce((s,b)=>s+b.amt-b.paid,0);
async function loadAll(){
const g=async t=>{const r=await sb.from(t).select('*').order('id');if(r.error)throw r.error;return r.data};
const [d,p,a,w,m,b]=await Promise.all(['doctors','patients','appointments','wards','medicines','bills'].map(g));
D.docs=d.map(x=>({id:x.id,name:x.name,spec:x.spec,bn:x.bn,room:x.room,fee:+x.fee}));
D.pts=p.map(x=>({id:x.id,name:x.name,age:x.age}));
D.apts=a.map(x=>({id:x.id,p:x.patient_id,d:x.doctor_id,date:x.date,time:x.time,st:x.status}));
D.wards=w.map(x=>({n:x.name,beds:x.beds,occ:x.occupied,fee:+x.daily_charge}));
D.meds=m.map(x=>({n:x.name,q:x.qty,pr:+x.price}));
D.bills=b.map(x=>({p:x.patient_id,item:x.item,amt:+x.amount,paid:+x.paid}))}
window.addEventListener('unhandledrejection',e=>alert((e.reason&&e.reason.message)||e.reason));
