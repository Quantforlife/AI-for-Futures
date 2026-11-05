// Multi-step waitlist. Field spec: [label, type, options]; a trailing * marks required.
const CATS=[
['delegate','Student Delegate','Attend the summit and learn','◈'],['hack','Hackathon Participant','Build for two days','⌘'],['comp','Parallel Competition Participant','Reels, prompts, posters, design','✦'],
['speaker','Speaker / Researcher','Share your research','◉'],['tech','Technology Partner','Tools, credits, sessions','⚙'],['sponsor','Sponsor','Support the summit','❖'],
['mentor','Mentor / Judge','Guide and evaluate teams','⚑'],['biz','Small Business Owner','Share a real problem','⌂'],['uni','University / Academic Institution','Collaborate across borders','▣'],['gen','General Enquiry','Ask us anything','?']];
const AR=['AI','Business','Research','Entrepreneurship','Design','Technology','Policy'];
const FS={
delegate:[['College name*','text'],['Course / Department*','text'],['Year of study*','select',['1st','2nd','3rd','4th / Final','Postgraduate','Other']],['Areas of interest','multi',AR]],
hack:[['College*','text'],['Course*','text'],['Background*','select',['Technical','Non-technical','Mixed']],['Participation*','select',['Individual','Existing team','Looking for teammates']],['Skills (optional)','multi',['Programming','AI / ML','Business','Product development','Design','Research','Marketing','Other']]],
comp:[['Competitions*','multi',['AI Reel Making','Prompt Engineering','AI-Assisted Poster Making','AI Design']]],
speaker:[['Current designation*','text'],['Institution*','text'],['Research area*','text'],['Proposed session topic','text'],['Preferred format*','select',['Virtual','In-person','Either']],['Profile or LinkedIn URL','url']],
tech:[['Company / Organisation*','text'],['Designation*','text'],['Official email*','email'],['Partnership interests','multi',['Workshops','Technical sessions','Tool access','Cloud credits','Mentorship','Hackathon judging','Technology demonstrations','Other']]],
sponsor:[['Company / Organisation*','text'],['Contact designation*','text'],['Type of support*','multi',['Financial','Food and refreshments','Technology','Prizes','Media','Equipment','Other']],['Message','textarea']],
mentor:[['Organisation*','text'],['Professional background*','text'],['Areas of expertise*','text'],['Preferred role*','multi',['Hackathon mentor','Technical judge','Business judge','Competition judge','Speaker']]],
biz:[['Business name*','text'],['Business sector*','text'],['Business city*','text'],['Main business challenge','textarea'],['Interested in*','multi',['Sharing a problem with students','Testing student-built solutions','Attending a workshop','Exploring AI adoption']]],
uni:[['Institution*','text'],['Institution country*','text'],['Department','text'],['Contact designation*','text'],['Interest*','multi',['Academic collaboration','International session','Student participation','Research collaboration','Speaker nomination']]],
gen:[['Organisation (optional)','text'],['Reason for enquiry*','text'],['Message*','textarea']]};
const PF=[['Full name*','text'],['Email address*','email'],['Phone number (optional)','tel'],['College / Organisation*','text'],['City','text'],['Country','text'],['Designation or academic year','text']];
const dlg=$('#dlg'),body=$('#body'),err=$('#err'),nx=$('#next'),bk=$('#back'),T=['HOW WOULD YOU LIKE TO BE INVOLVED?','About you','Details','Review'];
let step=0,sel=new Set(),D={},sending=false,done=false,refId=null;
const nm=(c,l)=>c+'|'+l,lab=l=>l.replace('*',''),live=()=>!!APP_CONFIG.endpoint,EM=/^\S+@\S+\.\S+$/;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function field(k,[l,t,o]){const v=D[k],id='f'+Math.abs([...k].reduce((a,c)=>a*31+c.charCodeAt(0)|0,7));
  if(t==='multi')return`<fieldset data-k="${esc(k)}"><legend>${esc(l)}</legend>${o.map(p=>`<label><input type="checkbox" value="${esc(p)}" ${(v||[]).includes(p)?'checked':''}> ${esc(p)}</label>`).join('')}</fieldset>`;
  const c=t==='select'?`<select id="${id}" data-k="${esc(k)}"><option value="">Select…</option>${o.map(p=>`<option ${v===p?'selected':''}>${esc(p)}</option>`).join('')}</select>`:t==='textarea'?`<textarea id="${id}" rows="3" data-k="${esc(k)}">${esc(v)}</textarea>`:`<input id="${id}" type="${t}" data-k="${esc(k)}" value="${esc(v)}">`;
  return`<label class="fl" for="${id}">${esc(l)}</label>${c}`}
function save(){$$('#body [data-k]').forEach(e=>{const k=e.dataset.k;D[k]=e.tagName==='FIELDSET'?[...e.querySelectorAll('input:checked')].map(i=>i.value):e.value.trim()})}
function summary(){let h='<dl class="sum">';PF.forEach(f=>{const v=D[nm('p',f[0])];v&&(h+=`<dt>${esc(lab(f[0]))}</dt><dd>${esc(v)}</dd>`)});
  [...sel].forEach(id=>{h+=`<dt>${CATS.find(c=>c[0]==id)[1]}</dt><dd>`+FS[id].map(f=>{const v=D[nm(id,f[0])];return v&&v.length?`${esc(lab(f[0]))}: ${esc([].concat(v).join(', '))}`:''}).filter(Boolean).join('<br>')+'</dd>'});return h+'</dl>'}
function render(){err.textContent='';$('#prog').innerHTML=T.map((t,i)=>`<i class="${i<=step?'on':''}" title="${t}"></i>`).join('');$('#dt').textContent=T[step];bk.style.visibility=step&&!done?'visible':'hidden';nx.textContent=step==3?'Submit':'Continue';nx.disabled=sending;
  if(step==0)body.innerHTML=`<p>Select all that apply.</p><div class="cards">${CATS.map(c=>`<label class="card"><input type="checkbox" name="cat" value="${c[0]}" ${sel.has(c[0])?'checked':''}><span class="ic" aria-hidden="true">${c[3]}</span><b>${c[1]}</b><small>${c[2]}</small></label>`).join('')}</div>`;
  if(step==1)body.innerHTML=PF.map(f=>field(nm('p',f[0]),f)).join('');
  if(step==2)body.innerHTML=[...sel].map(id=>`<h3>${CATS.find(c=>c[0]==id)[1]}</h3>`+FS[id].map(f=>field(nm(id,f[0]),f)).join('')).join('');
  if(step==3)body.innerHTML=summary()+`<label class="fl"><input type="checkbox" id="consent"> I agree that the organising team may contact me regarding AI Futures Goa and the activities I have selected.</label><p><a href="#" onclick="priv.showModal();return false">Privacy notice</a></p><input class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" id="hp">`+(live()?'':'<p class="demo">Demo mode: no backend is connected. Nothing will be saved.</p>');
  const f=body.querySelector('input:not(.hp),select,textarea');f&&f.focus()}
function validate(){save();
  if(step==0){sel=new Set($$('input[name=cat]:checked').map(i=>i.value));return sel.size?'':'Choose at least one option.'}
  const miss=[],chk=(k,f)=>{if(f[0].includes('*')){const v=D[k];if(!v||!v.length)miss.push(lab(f[0]))}};
  if(step==1){PF.forEach(f=>chk(nm('p',f[0]),f));const e=D[nm('p',PF[1][0])];if(e&&!EM.test(e))return'Enter a valid email address.'}
  if(step==2){sel.forEach(id=>FS[id].forEach(f=>chk(nm(id,f[0]),f)));
    for(const id of sel)for(const f of FS[id]){const v=D[nm(id,f[0])];if(v&&((f[1]=='email'&&!EM.test(v))||(f[1]=='url'&&!/^https?:\/\//.test(v))))return`Check the format of "${lab(f[0])}".`}}
  if(step==3&&!$('#consent').checked)return'Tick the consent box to submit.';
  return miss.length?'Complete: '+miss.join(', ')+'.':''}
const mkId=()=>'AFG-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
async function submit(){if(sending||$('#hp').value)return;sending=true;nx.disabled=true;err.textContent='Submitting…';refId=refId||mkId(); // same ID on retry so the server can de-duplicate
  const payload={id:refId,timestamp:new Date().toISOString(),categories:[...sel].map(i=>CATS.find(c=>c[0]==i)[1]),person:Object.fromEntries(PF.map(f=>[lab(f[0]),D[nm('p',f[0])]||''])),
    responses:Object.fromEntries([...sel].map(i=>[CATS.find(c=>c[0]==i)[1],Object.fromEntries(FS[i].map(f=>[lab(f[0]),[].concat(D[nm(i,f[0])]||[]).join(', ')]))])),consent:true,status:'New'};
  if(!live()){if(!APP_CONFIG.enableDemoMode){err.textContent='The waitlist is not connected yet. Please try again later.';sending=false;nx.disabled=false;return}return finish(true)}
  try{const ac=new AbortController(),to=setTimeout(()=>ac.abort(),15000);
    const r=await fetch(APP_CONFIG.endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),signal:ac.signal});clearTimeout(to);
    const j=await r.json();if(!r.ok||!j.ok)throw 0;finish(false)}
  catch(e){sending=false;nx.disabled=false;err.textContent='We could not confirm your submission. Check your connection and press Submit to retry. A retry will not create a duplicate.'}}
function finish(demo){done=true;sending=false;body.innerHTML=`<h2>YOU ARE ON OUR RADAR.</h2><p>Thank you for your interest in AI Futures Goa.</p><p>Your details have been received. Our organising team may contact you with relevant updates.</p><p>Reference ID: <b>${refId}</b></p>`+(demo?'<p class="demo">DEMO: no backend is connected, so your details were NOT saved.</p>':'');err.textContent='';$('#prog').innerHTML='';nx.textContent='Close';nx.disabled=false;bk.style.visibility='hidden'}
$('#f').onsubmit=e=>{e.preventDefault();if(done)return dlg.close();const m=validate();if(m){err.textContent=m;return}if(step==3)return submit();step++;render()};
bk.onclick=()=>{save();step--;render()};$('#close').onclick=()=>dlg.close();
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
function openForm(pre){if(done){step=0;sel=new Set();D={};done=false;refId=null}if(pre==='partner'&&!sel.size)sel=new Set(['tech','sponsor']);step=0;render();dlg.showModal()}
$$('[data-open]').forEach(b=>b.onclick=()=>openForm(b.dataset.open));
