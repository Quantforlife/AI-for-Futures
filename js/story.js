// STORY: chapter flow, transitions, portals, drone-photo comic dome (ch.5), final ACCESS DENIED sequence, pause/skip/replay.
(()=>{const G=window.G;if(!G)return;const $=s=>document.querySelector(s),T=G.T,S=G.S,CFG=window.CFG,sleep=ms=>new Promise(r=>setTimeout(r,ms));
$('#ename').textContent=CFG.EVENT_NAME;if(CFG.EVENT_LOGO){const l=$('#logo');l.src=CFG.EVENT_LOGO;l.hidden=false}
const br=$('#br');CFG.CHAPTERS.forEach((c,i)=>{const li=document.createElement('li');li.textContent='0'+(i+1)+' — '+c;br.appendChild(li)});
const prog=i=>[...br.children].forEach((li,k)=>{li.classList.toggle('on',k===i);li.classList.toggle('done',k<i)});
const eyeCol=c=>G.eyes.children.forEach(e=>e.material.color.set(c));
const wipe=mid=>{const e=$('#wipe');G.sfx(300,.5,'sawtooth',.05,1200);gsap.fromTo(e,{clipPath:'circle(0% at 50% 50%)'},{clipPath:'circle(150% at 50% 50%)',duration:.7,ease:'power2.in',onComplete(){mid();gsap.to(e,{clipPath:'circle(0% at 50% 50%)',duration:.8,delay:.25,ease:'power2.out'})}})};
let dome,tex;
const domeMat=()=>new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{map:{value:tex},op:{value:1}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 // comic treatment of the REAL photo: posterise + saturate + warm shift + halftone dots + vignette
 fragmentShader:'uniform sampler2D map;uniform float op;varying vec2 v;void main(){vec3 c=texture2D(map,v).rgb;float l=dot(c,vec3(.3,.59,.11));c=mix(vec3(l),c,1.7);c=floor(c*5.+.5)/5.;c*=vec3(1.08,1.02,.92);vec2 g=fract(gl_FragCoord.xy/5.)-.5;float d=length(g);c*=mix(.78,1.,smoothstep(.2+.35*l,.1+.3*l,d)*.6+.4);gl_FragColor=vec4(c,op);}'});
function clearWorld(){if(S.w){G.sc.remove(S.w.g);S.w.tw&&S.w.tw.kill()}if(dome){G.sc.remove(dome);dome=null}G.cineTick=null;gsap.killTweensOf(G.cam);G.cam.fov=60;G.cam.updateProjectionMatrix();document.body.classList.remove('hideui');$('#cine').hidden=true;$('#final').hidden=true;eyeCol(0x18d4c8)}
function place(w){G.bot.visible=true;G.bot.scale.setScalar(1);G.bot.up.set(0,1,0);G.bot.position.copy(w.spawn);G.bot.rotation.set(0,w.face,0);S.vel.set(0,0,0);S.vy=0;S.yaw=w.yaw;S.pitch=.35;S.speed=0;G.cam.up.set(0,1,0);G.cam.position.copy(w.spawn).add(new T.Vector3(Math.sin(w.yaw)*22,12,Math.cos(w.yaw)*22));S.mode='intro';S.nearby=null;$('#prompt').hidden=true;setTimeout(()=>{if(S.mode==='intro')S.mode='play'},2600)}
async function enter(n){clearWorld();prog(n);const w=S.w=window.WORLDS[Math.min(n,4)]();G.sc.add(w.g);G.sc.background=w.bg;G.sc.fog=w.fog?new T.Fog(w.fog[0],w.fog[1],w.fog[2]):null;S.ch=n;
 if(n===1){G.obj('');G.bot.visible=true;S.mode='cine';w.cine(()=>go(2));return}
 w.onBeacon=()=>{G.scan();if(n===0){G.say('Signal locked. Opening a global projection…');G.obj('')}setTimeout(()=>go(n+1),n===0?1400:900)};
 if(n===0){place(w);G.obj('FIND THE SIGNAL BEACON');G.say('CONNECTION ESTABLISHED.',2200);setTimeout(()=>G.say('UNIDENTIFIED SIGNAL DETECTED.',3200),2400)}
 if(n===2){place(w);G.obj('FOLLOW THE SIGNAL → PANJIM');G.say('SIGNAL DETECTED. GOA, INDIA.',3000)}
 if(n===3){place(w);G.obj('REACH THE PORTAL → BAMBOLIM');G.say('PANAJI · PANJIM. A new signal appears…',3200)}
 if(n===4){w.onBeacon=()=>finale();aerial(w)}}
function aerial(w){S.mode='cine';w.g.visible=false;G.bot.visible=false;document.body.classList.add('hideui');G.sc.fog=null;G.sc.background=new T.Color(0xdde8ee);
 const geo=new T.SphereGeometry(300,64,32);geo.scale(-1,1,1);dome=new T.Mesh(geo,domeMat());dome.renderOrder=-10;G.sc.add(dome);
 const c=CFG.COLLEGE_COORDINATES,txt=$('#cine');txt.hidden=false;txt.innerHTML='BAMBOLIM, GOA<br><small>'+c.lat.toFixed(6)+'° N, '+c.lon.toFixed(6)+'° E</small>';G.cam.position.set(0,0,0);G.cam.fov=85;G.cam.updateProjectionMatrix();
 const o={y:.55,f:85};G.cineTick=()=>{G.cam.lookAt(-Math.cos(o.y),-.04,Math.sin(o.y)*-1);G.cam.fov=o.f;G.cam.updateProjectionMatrix()};
 G.sfx(180,2,'sawtooth',.04,700);
 gsap.to(o,{y:0,f:42,duration:6,ease:'power2.inOut',onComplete(){txt.hidden=true;wipe(()=>{G.cineTick=null;dome.visible=false;w.g.visible=true;G.sc.fog=new T.Fog(w.fog[0],w.fog[1],w.fog[2]);G.sc.background=w.bg;G.cam.fov=60;G.cam.updateProjectionMatrix();place(w);G.obj('APPROACH THE ACCESS TERMINAL');G.say('Drone view → ground level. The real campus, illustrated.',3800)})}})}
async function finale(){S.mode='frozen';$('#prompt').hidden=true;G.obj('');document.body.classList.add('hideui');G.sc.fog&&(G.sc.fog.far=400);const f=$('#final');f.hidden=false;f.className='';['denied','soon','ev','req','rst','nope'].forEach(i=>$('#'+i).style.visibility='hidden');$('#tlog').textContent='';
 const L=['SCANNING LOCATION...','ESTABLISHING CONNECTION...','IDENTITY VERIFIED.','ACCESS REQUESTED.'];G.scan();for(const l of L){$('#tlog').textContent+=l+'\n';G.sfx(900,.1,'square',.05);await sleep(900)}
 f.classList.add('glitch');G.sfx(70,.6,'sawtooth',.12,40);eyeCol(0xff2a3d);await sleep(550);f.classList.remove('glitch');
 $('#tlog').textContent='';$('#denied').style.visibility=$('#soon').style.visibility='visible';$('#ev').textContent='RESTRICTED DESTINATION. '+[CFG.EVENT_NAME,CFG.INSTITUTION_NAME].filter(Boolean).join(' · ');['ev','req','rst'].forEach(i=>$('#'+i).style.visibility='visible');prog(5);br.children[5].classList.add('on')}
$('#req').onclick=()=>{$('#nope').style.visibility='visible';$('#nope').textContent='"NOT YET."';G.sfx(110,.3,'square',.08)};
$('#rst').onclick=()=>{S.found=0;go(0)};
function go(n){if(n>=5){wipe(()=>{enter(4).then?0:0;setTimeout(()=>{if(dome)dome.visible=false;S.w.g.visible=true;G.bot.visible=true;place(S.w);S.mode='frozen';finale()},300)});return}wipe(()=>enter(n))}
// pause / skip
const pz=$('#pause'),chs=$('#chs');CFG.CHAPTERS.forEach((c,i)=>{const b=document.createElement('button');b.className='b';b.textContent='0'+(i+1);b.title=c;b.setAttribute('aria-label','Skip to '+c);b.onclick=()=>{pz.hidden=true;S.mode='play';go(i)};chs.appendChild(b)});
let pm='play';G.pause=()=>{if(S.mode==='paused'){S.mode=pm;pz.hidden=true}else if(S.mode==='play'||S.mode==='intro'||S.mode==='cine'){pm=S.mode;S.mode='paused';pz.hidden=false;document.exitPointerLock?.()}};
$('#pz').onclick=G.pause;$('#resume').onclick=G.pause;
G.interact=()=>{const it=S.nearby;if(S.mode==='play'&&it&&!(it.done&&!it.again)){G.sfx(660,.12,'triangle',.07);it.act&&it.act()}};
setInterval(()=>{if(S.mode==='play'&&S.speed>1.5){S.mv=(S.mv||0)+.5;if(S.mv>6)$('#bl').classList.add('off')}},500);
// boot: load drone photo then start (failure is non-fatal: dome falls back to plain sky)
new T.TextureLoader().load(CFG.COLLEGE_DRONE_IMAGE,t=>{tex=t;boot()},undefined,()=>{tex=new T.Texture();boot()});
function boot(){$('#load').remove();G.start();enter(0)}
})();
