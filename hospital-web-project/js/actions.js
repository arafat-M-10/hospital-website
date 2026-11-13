const SLOTS=['10:00','11:00','12:00','16:00','17:00'];
async function addPt(n,a){n=(n||'').trim();if(!n)return null;const r=await sb.from('patients').insert({name:n,age:+a||0}).select().single();if(r.error)throw r.error;await loadAll();view();return r.data}
async function book(p,d,dt){dt=dt||day(1);for(const t of SLOTS){const r=await sb.from('appointments').insert({patient_id:p,doctor_id:d,date:dt,time:t,status:'BOOKED'});
if(!r.error){await loadAll();view();return{date:dt,time:t}}if(r.error.code!=='23505')throw r.error}return null}
async function setStatus(id,st){const r=await sb.from('appointments').update({status:st}).eq('id',id);if(r.error)throw r.error;await loadAll();view()}
const cancel=id=>setStatus(id,'CANCELLED'),done=id=>setStatus(id,'COMPLETED');
