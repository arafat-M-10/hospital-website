/* chat + voice */
function say(w,t){const m=document.createElement('div');m.className='m '+w;m.textContent=t;$('#log').append(m);$('#log').scrollTop=1e9;return m}
function speak(t){if(!$('#spk').checked||!window.speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t.replace(/[৳\n]/g,' '));u.lang=$('#lang').value;speechSynthesis.speak(u)}
async function send(v,voice){v=(v||$('#q').value).trim();if(!v)return;$('#q').value='';say('u',v);let r;try{r=await brain(v)}catch(e){r='কাজটি করা যায়নি: '+(e.message||e)}say('a',r);if(voice||$('#mic').classList.contains('rec'))speak(r)}
$('#snd').onclick=()=>send();$('#q').onkeydown=e=>{if(e.key=='Enter')send()};
$('#chips').onclick=e=>{if(e.target.tagName=='BUTTON')send(e.target.textContent)};
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let rec=null;
$('#mic').onclick=()=>{if(!SR){say('a','এই ব্রাউজারে ভয়েস ইনপুট চলে না। Chrome বা Edge ব্যবহার করুন।');return}
if(rec){rec.stop();return}rec=new SR();rec.lang=$('#lang').value;rec.interimResults=false;$('#mic').classList.add('rec');
rec.onresult=e=>{const t=e.results[0][0].transcript;rec=null;$('#mic').classList.remove('rec');send(t,true)};
rec.onerror=e=>{say('a','মাইক চালু হয়নি ('+e.error+'). ব্রাউজারে মাইকের অনুমতি দিন।')};rec.onend=()=>{rec=null;$('#mic').classList.remove('rec')};try{rec.start()}catch(x){rec=null;$('#mic').classList.remove('rec')}};
boot();
