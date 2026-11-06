// ENGINE: renderer, toon helpers, robot, controls, third-person camera, collisions, audio, UI helpers. Exposes window.G.
(()=>{const $=s=>document.querySelector(s),T=THREE,CFG=window.CFG,MOB=matchMedia('(pointer:coarse)').matches;
let R;try{R=new T.WebGLRenderer({antialias:!MOB,powerPreference:'high-performance'});if(!R.getContext())throw 0}catch(e){document.documentElement.classList.add('nogl');$('#load').remove();window.G=null;return}
R.setPixelRatio(Math.min(devicePixelRatio,MOB?1.5:2));document.body.prepend(R.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(60,1,.1,700);sc.add(cam,new T.HemisphereLight(0xffffff,0x8a7050,1.05));const sun=new T.DirectionalLight(0xffffff,1.1);sun.position.set(30,50,20);sc.add(sun);
const GR=new T.DataTexture(new Uint8Array([90,175,255]),3,1,T.RedFormat);GR.minFilter=GR.magFilter=T.NearestFilter;GR.needsUpdate=true;
const OUT=new T.MeshBasicMaterial({color:0x17102b,side:T.BackSide}),mat=(c,e)=>new T.MeshToonMaterial(Object.assign({color:c,gradientMap:GR},e));
const mk=(geo,c,o=.03,e)=>{const m=new T.Mesh(geo,mat(c,e));if(o){const k=new T.Mesh(geo,OUT);k.scale.setScalar(1+o);m.add(k)}return m};
const box=(w,sx,sy,sz,x,y,z,c,solid=1,o=.02)=>{const m=mk(new T.BoxGeometry(sx,sy,sz),c,o);m.position.set(x,y+sy/2,z);w.g.add(m);if(solid){w.cols.push({x0:x-sx/2,x1:x+sx/2,z0:z-sz/2,z1:z+sz/2,y1:y+sy});w.ms.push(m)}return m};
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
// ROBOT: original character, faces +Z
const bot=new T.Group(),B=new T.Group();bot.add(B);
const body=mk(new T.SphereGeometry(.55,24,16),0xfff4dc);body.position.y=1;B.add(body);
const vis=mk(new T.SphereGeometry(.42,20,12),0x1b1340,0);vis.scale.set(1,.72,.55);vis.position.set(0,1.03,.36);B.add(vis);
const eyes=new T.Group();[-.15,.15].forEach(x=>{const e=new T.Mesh(new T.CircleGeometry(.09,16),new T.MeshBasicMaterial({color:0x18d4c8}));e.position.set(x,0,0);eyes.add(e)});eyes.position.set(0,1.05,.585);B.add(eyes);
const ring=mk(new T.TorusGeometry(.5,.07,8,28),0xff2e93);ring.rotation.x=Math.PI/2;ring.position.y=.4;B.add(ring);
const ant=new T.Group();ant.add(mk(new T.CylinderGeometry(.03,.03,.3,6),0x17102b,0));const ab=mk(new T.SphereGeometry(.09,10,8),0xffd23f);ab.position.y=.2;ant.add(ab);ant.position.y=1.5;B.add(ant);
[-1,1].forEach(s=>{const a=mk(new T.SphereGeometry(.14,10,8),0x2d5bff);a.position.set(s*.62,.95,0);B.add(a)});sc.add(bot);
const S={mode:'load',yaw:Math.PI,pitch:.35,vel:new T.Vector3(),vy:0,ground:true,t:0,anim:null,animT:0,intro:0,nearby:null,camD:6,w:null,sound:false},keys={},joy={x:0,y:0},look={dx:0,dy:0};
let ac;const sfx=(f=440,d=.12,type='square',v=.05,f2)=>{if(!S.sound||!ac)return;const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,ac.currentTime);f2&&o.frequency.exponentialRampToValueAtTime(f2,ac.currentTime+d);g.gain.setValueAtTime(v,ac.currentTime);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+d)};
$('#snd').onclick=e=>{S.sound=!S.sound;if(S.sound&&!ac)ac=new(window.AudioContext||window.webkitAudioContext)();e.target.textContent=S.sound?'SOUND ON':'SOUND OFF';e.target.setAttribute('aria-pressed',S.sound);sfx(660,.15)};
let sayT;const say=(t,ms=3200)=>{const s=$('#say');s.textContent=t;s.classList.add('on');clearTimeout(sayT);sayT=setTimeout(()=>s.classList.remove('on'),ms)},obj=t=>$('#obj').textContent=t||'';
// INPUT
addEventListener('keydown',e=>{keys[e.code]=1;if(e.code==='KeyE')G.interact();if(e.code==='Escape')G.pause();if(e.code==='Space')e.preventDefault()});addEventListener('keyup',e=>keys[e.code]=0);
R.domElement.addEventListener('click',()=>{if(!MOB&&S.mode==='play'&&!document.pointerLockElement)R.domElement.requestPointerLock?.()});
addEventListener('mousemove',e=>{if(document.pointerLockElement){S.yaw-=e.movementX*.0025;S.pitch=Math.max(-.2,Math.min(1.2,S.pitch+e.movementY*.0025))}});
let lp=null;R.domElement.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')lp={id:e.pointerId,x:e.clientX,y:e.clientY}});
addEventListener('pointermove',e=>{if(lp&&e.pointerId===lp.id){S.yaw-=(e.clientX-lp.x)*.005;S.pitch=Math.max(-.2,Math.min(1.2,S.pitch+(e.clientY-lp.y)*.005));lp.x=e.clientX;lp.y=e.clientY}});addEventListener('pointerup',e=>{if(lp&&e.pointerId===lp.id)lp=null});
const jz=$('#joy'),jk=jz.firstElementChild;let jid=null;const jm=e=>{const r=jz.getBoundingClientRect();let x=(e.clientX-r.left-60)/50,y=(e.clientY-r.top-60)/50,l=Math.hypot(x,y);if(l>1){x/=l;y/=l}joy.x=x;joy.y=y;jk.style.transform=`translate(${x*35}px,${y*35}px)`};
jz.addEventListener('pointerdown',e=>{jid=e.pointerId;jz.setPointerCapture(jid);jm(e)});jz.addEventListener('pointermove',e=>{if(e.pointerId===jid)jm(e)});const je=()=>{jid=null;joy.x=joy.y=0;jk.style.transform=''};jz.addEventListener('pointerup',je);jz.addEventListener('pointercancel',je);
$('#bj').addEventListener('pointerdown',()=>keys.Space=1);$('#bj').addEventListener('pointerup',()=>keys.Space=0);$('#bi').addEventListener('pointerdown',()=>G.interact());
// LOOP
const tmp=new T.Vector3(),ray=new T.Raycaster(),cp=new T.Vector3(),ct=new T.Vector3();let last=performance.now();
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;S.t+=dt;const w=S.w;
 if(w){w.tick&&w.tick(dt,S.t);
  if(S.mode==='play'||S.mode==='intro'){
   const lock=S.mode==='intro',ix=lock?0:(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+joy.x,iz=lock?0:(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0)+joy.y,l=Math.min(1,Math.hypot(ix,iz)),sp=(keys.ShiftLeft||keys.ShiftRight?9.5:5.5)*l;
   if(l>.05){const a=Math.atan2(ix,iz)+S.yaw,tx=Math.sin(a)*sp,tz=Math.cos(a)*sp;S.vel.x+=(tx-S.vel.x)*Math.min(1,dt*10);S.vel.z+=(tz-S.vel.z)*Math.min(1,dt*10);let d=Math.atan2(S.vel.x,S.vel.z)-bot.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));bot.rotation.y+=d*Math.min(1,dt*10)}else{S.vel.x*=1-Math.min(1,dt*9);S.vel.z*=1-Math.min(1,dt*9)}
   const gy=w.ground?w.ground(bot.position.x,bot.position.z):0;
   if(!lock&&keys.Space){if(S.ground){S.vy=8;S.ground=false;sfx(300,.2,'square',.05,700)}else if(S.vy<0){S.vy=Math.max(S.vy,-1.6);sfx(120,.05,'sawtooth',.012)}}
   S.vy-=22*dt;bot.position.y+=S.vy*dt;if(bot.position.y<=gy){if(!S.ground&&S.vy<-6){S.land=.25;sfx(90,.12,'sine',.08)}bot.position.y=gy;S.vy=0;S.ground=true}else if(bot.position.y>gy+.05)S.ground=false;
   bot.position.x+=S.vel.x*dt;bot.position.z+=S.vel.z*dt;const p=bot.position,r=.55;
   for(const c of w.cols){if(p.y>=c.y1-.3)continue;const cx=Math.max(c.x0,Math.min(p.x,c.x1)),cz=Math.max(c.z0,Math.min(p.z,c.z1)),dx=p.x-cx,dz=p.z-cz,d=Math.hypot(dx,dz);if(d<r){if(d>1e-4){p.x=cx+dx/d*r;p.z=cz+dz/d*r}else p.x=c.x0-r}}
   const bd=w.bounds;p.x=Math.max(bd[0],Math.min(bd[1],p.x));p.z=Math.max(bd[2],Math.min(bd[3],p.z));
   S.speed=Math.hypot(S.vel.x,S.vel.z);
   // nearest interactable
   let n=null,nd=3;for(const it of w.inter){if(it.done&&!it.again)continue;const d=Math.hypot(it.pos.x-p.x,it.pos.z-p.z,(it.pos.y-p.y)*.4);if(d<nd){nd=d;n=it}}
   if(n!==S.nearby){S.nearby=n;const pr=$('#prompt');pr.hidden=!n;if(n)pr.textContent=(MOB?'TAP E':'PRESS E')+' · '+n.label}
   // camera
   const D=w.camD||6,off=tmp.set(Math.sin(S.yaw)*Math.cos(S.pitch),Math.sin(S.pitch),Math.cos(S.yaw)*Math.cos(S.pitch));ct.set(p.x,p.y+1.3,p.z);
   let dist=D;ray.set(ct,off.clone());ray.far=D;const h=ray.intersectObjects(w.ms,false)[0];if(h)dist=Math.max(1.2,h.distance-.4);
   cp.copy(ct).addScaledVector(off,dist);cam.position.lerp(cp,Math.min(1,dt*(S.mode==='intro'?2.2:9)));cam.lookAt(ct)}
  // robot animation
  const sp=S.speed||0,tt=S.t;B.position.y=.2+Math.sin(tt*3)*.07*(1-Math.min(1,sp/4));B.rotation.x=sp>.5?.18*Math.min(1,sp/9):0;ring.rotation.z+=dt*(2+sp*.8+(S.anim==='scan'?14:0));
  const bl=(tt%3.6)<.12?.15:1;eyes.scale.y=bl;let sq=1;if(S.land>0){S.land-=dt;sq=1-S.land*1.2}B.scale.set(1/Math.sqrt(sq),sq,1/Math.sqrt(sq));
  if(!S.ground)B.scale.set(.92,1.12,.92);
  if(S.anim){S.animT+=dt;if(S.anim==='scan'){eyes.scale.x=1+Math.sin(S.animT*40)*.5;eyes.position.x=Math.sin(S.animT*8)*.12}if(S.anim==='cheer'){B.rotation.y=S.animT*12;if(S.animT>.8)S.anim=null}if(S.anim==='scan'&&S.animT>1.3){S.anim=null;eyes.position.x=0;eyes.scale.x=1}}
  else{eyes.scale.x=1;if(sp<.3){B.rotation.y=Math.sin(tt*.7)*.35*(Math.sin(tt*.3)>.4?1:0)}else B.rotation.y=0;eyes.position.x=0}
  ant.rotation.z=Math.sin(tt*5)*.15;
 }
 if(G.cineTick)G.cineTick(dt);R.render(sc,cam)}
function resize(){R.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}addEventListener('resize',resize);resize();
window.G={T,R,sc,cam,bot,S,mk,mat,box,rnd,say,obj,sfx,MOB,sun,eyes,scan(){S.anim='scan';S.animT=0;sfx(500,.9,'sawtooth',.04,1400)},cheer(){S.anim='cheer';S.animT=0;sfx(520,.3,'triangle',.08,1040)},start(){requestAnimationFrame(frame)},look,pause:()=>{}, interact:()=>{}};
})();
