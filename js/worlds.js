// WORLDS: one builder per chapter. Each returns {g,cols,ms,inter,bounds,ground,camD,spawn,yaw,tick,bg,fog}. All geometry is procedural (no external models).
(()=>{const G=window.G;if(!G)return;const T=G.T,{mk,mat,box,rnd}=G,V=(x,y,z)=>new T.Vector3(x,y,z);
const W=()=>({g:new T.Group(),cols:[],ms:[],inter:[],bounds:[-50,50,-50,50],camD:6,ticks:[],tick(dt,t){this.ticks.forEach(f=>f(dt,t))}});
const grad=(a,b,c)=>{const cv=document.createElement('canvas');cv.width=2;cv.height=256;const x=cv.getContext('2d'),g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,a);g.addColorStop(.55,b);g.addColorStop(1,c);x.fillStyle=g;x.fillRect(0,0,2,256);return new T.CanvasTexture(cv)};
const glow=c=>new T.MeshBasicMaterial({color:c}),plane=(w,sx,sz,x,y,z,c)=>{const m=new T.Mesh(new T.PlaneGeometry(sx,sz),mat(c));m.rotation.x=-Math.PI/2;m.position.set(x,y,z);w.g.add(m);return m};
const beacon=(w,x,z,col,label,act,again)=>{const g=new T.Group(),core=new T.Mesh(new T.ConeGeometry(.5,2.4,8),glow(col)),r=new T.Mesh(new T.TorusGeometry(.9,.07,8,24),glow(col));core.position.y=1.5;core.rotation.x=Math.PI;r.rotation.x=Math.PI/2;r.position.y=.2;g.add(core,r);g.position.set(x,0,z);w.g.add(g);w.ticks.push((dt,t)=>{core.rotation.y+=dt*2;core.position.y=1.5+Math.sin(t*3)*.2;r.scale.setScalar(1+Math.sin(t*4)*.15)});const it={pos:V(x,1,z),label,act,again,g};w.inter.push(it);return it};
const shard=(w,x,y,z,msg)=>{const m=mk(new T.OctahedronGeometry(.35),0xffd23f,.06);m.position.set(x,y,z);w.g.add(m);w.ticks.push((dt,t)=>{m.rotation.y+=dt*2;m.position.y=y+Math.sin(t*2)*.12});const it={pos:V(x,y,z),label:'SCAN SIGNAL SHARD',act(){m.visible=false;it.done=1;G.cheer();G.say(msg,3500);G.S.found=(G.S.found||0)+1},g:m};w.inter.push(it)};
const tree=(w,x,z,s=1,c=0x2fae5a)=>{const t=mk(new T.CylinderGeometry(.18*s,.25*s,2*s,6),0x7a4a2a);t.position.set(x,s,z);const l=mk(new T.IcosahedronGeometry(1.3*s,0),c);l.position.y=2.3*s;t.add(l);w.g.add(t)};
const palm=(w,x,z)=>{const g=new T.Group(),tr=mk(new T.CylinderGeometry(.14,.22,5,6),0xa8743c);tr.position.y=2.5;tr.rotation.z=.12;g.add(tr);for(let i=0;i<7;i++){const l=mk(new T.ConeGeometry(.35,3,4),i%2?0x1fa05a:0x37c46b,.04);l.scale.z=.3;l.position.set(Math.cos(i)*1.1+.5,5,Math.sin(i)*1.1);l.rotation.set(Math.sin(i)*1.2,0,-Math.cos(i)*1.2-1.2);g.add(l)}g.position.set(x,0,z);w.g.add(g)};
const house=(w,x,z,sx,sy,sz,c,roof=0xd8442a)=>{box(w,sx,sy,sz,x,0,z,c);const r=mk(new T.ConeGeometry(Math.max(sx,sz)*.78,sy*.45,4),roof,.03);r.rotation.y=Math.PI/4;r.position.set(x,sy+sy*.22,z);w.g.add(r);const d=box(w,.9,1.7,.1,x,0,z+sz/2+.03,0x2d5bff,0,0);[-1,1].forEach(s=>box(w,.8,1,.1,x+s*sx*.3,sy*.55,z+sz/2+.03,0xfff4dc,0,0))};
const birds=(w,n,cx,cy,cz,rad,col)=>{const bs=[];for(let i=0;i<n;i++){const b=new T.Group();[-1,1].forEach(s=>{const wg=new T.Mesh(new T.BoxGeometry(.7,.04,.25),glow(col));wg.position.x=s*.35;b.add(wg);b.userData.w=b.userData.w||[];b.userData.w.push(wg)});w.g.add(b);bs.push(b)}w.ticks.push((dt,t)=>bs.forEach((b,i)=>{const a=t*.4+i*6.28/n,r=rad*(1+.3*Math.sin(i));b.position.set(cx+Math.cos(a)*r,cy+Math.sin(t+i)*1.5,cz+Math.sin(a)*r);b.rotation.y=-a;b.userData.w[0].rotation.z=Math.sin(t*9+i)*.5;b.userData.w[1].rotation.z=-Math.sin(t*9+i)*.5}))};
const clouds=(w,n,y,spread)=>{for(let i=0;i<n;i++){const c=new T.Group();for(let k=0;k<4;k++){const s=mk(new T.SphereGeometry(3+rnd()*3,8,6),0xfff4e8,.02);s.position.set(k*4-6,rnd()*2,rnd()*3);s.scale.y=.6;c.add(s)}c.position.set((rnd()-.5)*spread,y+rnd()*15,-60-rnd()*100);w.g.add(c);w.ticks.push(dt=>{c.position.x+=dt*.8;if(c.position.x>spread/2)c.position.x=-spread/2})}};
const WORLDS=[];
// CH1 GOLDEN GATE
WORLDS[0]=()=>{const w=W();w.bg=grad('#2d2a8c','#ff5d8f','#ffb35a');w.fog=[0xffa070,60,260];w.bounds=[-58,58,-3.7,3.7];w.spawn=V(-48,0,0);w.yaw=-Math.PI/2;w.face=Math.PI/2;w.camD=6.5;
 box(w,140,.7,9,0,-.7,0,0x5b5f77,0);box(w,140,.05,.3,0,.01,0,0xffd23f,0,0);[-1,1].forEach(s=>{box(w,140,1.2,.25,0,0,s*4.3,0xe8432a);for(let x=-68;x<=68;x+=4)box(w,.2,.9,.2,x,1.2,s*4.3,0xe8432a,0,0)});
 const OR=0xe8432a;[-30,30].forEach(x=>{[-1,1].forEach(s=>box(w,1.7,40,1.7,x,-14,s*4.9,OR,0,.03));[12,22,32].forEach(y=>box(w,1.4,1.6,11.4,x,y,0,OR,0,.03));box(w,2.4,1,11.8,x,26,0,OR,0,.03)});
 [-1,1].forEach(s=>{const pts=[];for(let x=-70;x<=70;x+=2){const a=Math.abs(x),y=a<30?3.5+(26-3.5)*Math.pow(a/30,2):26-(a-30)*.55;pts.push(V(x,y,s*4.9))}w.g.add(mk(new T.TubeGeometry(new T.CatmullRomCurve3(pts),80,.28,6),OR,.05));for(let x=-28;x<=28;x+=3){const y=3.5+(26-3.5)*Math.pow(Math.abs(x)/30,2);box(w,.08,y,.08,x,0,s*4.9,0xffb35a,0,0)}});
 const sea=new T.Mesh(new T.PlaneGeometry(900,900),mat(0x1d7fd6));sea.rotation.x=-Math.PI/2;sea.position.y=-18;w.g.add(sea);
 const sunm=new T.Mesh(new T.CircleGeometry(26,32),new T.MeshBasicMaterial({color:0xffe27a,fog:false}));sunm.position.set(120,18,-250);w.g.add(sunm);
 for(let i=0;i<26;i++){const h=8+rnd()*34;box(w,6+rnd()*5,h,6+rnd()*5,-190-rnd()*50,-18,-40+rnd()*110,[0xffe6c7,0xff9ec4,0x9ee6ff,0xfff]['0123'[i%4]|0],0,.01)}
 for(let i=0;i<8;i++){const h=new T.Mesh(new T.ConeGeometry(30+rnd()*20,22+rnd()*20,6),mat(0x2f9e55));h.position.set(130+rnd()*120,-6,-60+rnd()*160);w.g.add(h)}
 clouds(w,7,28,260);birds(w,6,-6,10,0,18,0xffffff);
 beacon(w,6,0,0x18d4c8,'ACTIVATE SIGNAL BEACON',()=>w.onBeacon&&w.onBeacon());shard(w,-22,1.4,2.2,'"A hidden signal… ?" — static crackle');return w};
// CH3 GOA
WORLDS[2]=()=>{const w=W();w.bg=grad('#27b8ff','#aeeaff','#fff6d8');w.fog=[0xcdf4ff,50,230];w.bounds=[-30,30,-36,18];w.spawn=V(0,0,14);w.yaw=0;w.face=Math.PI;w.camD=7;
 plane(w,400,400,0,-.03,-40,0x3fbf63);plane(w,400,40,0,-.02,38,0xfff0c0);plane(w,400,200,0,-.5,150,0x14c7c0);plane(w,6,200,0,.01,-60,0x4a4560);for(let z=16;z>-40;z-=4)plane(w,.25,1.8,0,.03,z,0xfff4dc);
 const cols=[0xffd23f,0xff6fa5,0x4de2d4,0xff9a3c,0xa88cff,0xffffff];for(let i=0;i<16;i++){const s=i%2?1:-1;house(w,s*(9+rnd()*10),10-i*3.2,4+rnd()*2,3+rnd()*2.5,4+rnd()*1.5,cols[i%6])}
 box(w,8,6,9,-14,0,-22,0xffffff);const gb=mk(new T.CylinderGeometry(.01,4.6,3,3),0xffffff,.02);gb.rotation.set(Math.PI/2,0,0);gb.rotation.y=0;gb.position.set(-14,7,-17.4);gb.rotation.z=Math.PI/2*0;w.g.add(gb);box(w,2.6,10,2.6,-9,0,-22,0xffffff);box(w,3.2,1.2,3.2,-9,10,-22,0x2d5bff,0);
 for(let i=0;i<30;i++){const x=(rnd()-.5)*56;if(Math.abs(x)>4.5)palm(w,x,-34+rnd()*50)}
 for(let i=0;i<7;i++){const h=new T.Mesh(new T.ConeGeometry(40+rnd()*30,30+rnd()*25,7),mat(0x2e9b58));h.position.set(-150+i*50,0,-170);w.g.add(h)}
 clouds(w,6,30,260);birds(w,5,0,14,-10,16,0xffffff);
 beacon(w,0,-31,0xff2e93,'FOLLOW SIGNAL → PANJIM',()=>w.onBeacon&&w.onBeacon());shard(w,18,1,8,'A seashell with a circuit pattern.');return w};
// CH4 PANJIM
WORLDS[3]=()=>{const w=W();w.bg=grad('#3a7bff','#ffb0d0','#ffe9b0');w.fog=[0xffe2d0,60,240];w.bounds=[-26,26,-13.6,26];w.spawn=V(0,0,22);w.yaw=0;w.face=Math.PI;w.camD=7.5;
 const H=.35;w.ground=(x,z)=>Math.abs(x)<8&&z<-2&&z>-14?(z>-10?Math.floor(-2-z)*H+H:2.8):0;plane(w,300,300,0,-.02,0,0xf6e6c4);plane(w,16,4,0,0,0,0xd96a52);
 for(let i=0;i<8;i++)box(w,16,H*(i+1),1,0,0,-2.5-i,0xffffff,0,.01);box(w,16,2.8,5,0,0,-12,0xffffff,0,.01);
 const WH=0xffffff;box(w,15,10,9,0,2.8,-19,WH);box(w,4,6,.3,0,2.8,-14.4,0x23304d,0,0);[-1,1].forEach(s=>{box(w,3.4,14,3.4,s*6.4,2.8,-15.5,WH);const d=mk(new T.SphereGeometry(2,16,8,0,6.283,0,1.57),0x2d5bff);d.position.set(s*6.4,16.8,-15.5);w.g.add(d);box(w,.2,1.6,.2,s*6.4,18.7,-15.5,0xffd23f,0,0);box(w,1,.2,.2,s*6.4,19.6,-15.5,0xffd23f,0,0);box(w,1.2,2.6,.2,s*6.4,9,-13.7,0x23304d,0,0);box(w,1.2,2.6,.2,s*6.4,13.5,-13.7,0x23304d,0,0)});
 const pd=mk(new T.CylinderGeometry(.01,5.4,1,3),WH,.02);pd.rotation.set(Math.PI/2,0,0);pd.rotation.z=0;pd.scale.set(1.3,1,1.1);pd.position.set(0,14.4,-14.5);pd.rotation.y=Math.PI/2;w.g.add(pd);
 const pc=[0xffd23f,0xff6fa5,0x4de2d4,0xff9a3c,0xa88cff];for(let i=0;i<9;i++){const s=i%2?1:-1,z=18-Math.floor(i/2)*7;house(w,s*(16+rnd()*4),z,6,5+rnd()*4,6,pc[i%5])}
 for(let i=0;i<10;i++)tree(w,(rnd()>.5?1:-1)*(10+rnd()*8),20-rnd()*22,1+rnd()*.5);
 clouds(w,5,30,260);birds(w,8,0,12,-4,10,0xffffff);
 const pr=beacon(w,-12,8,0xa88cff,'ENTER PORTAL → BAMBOLIM',()=>w.onBeacon&&w.onBeacon());shard(w,18,.9,12,'Pigeon-coded message: "keep going".');return w};
// CH5 BAMBOLIM: reconstruction guided by the supplied drone + entrance photos
WORLDS[4]=()=>{const w=W();w.bg=grad('#3d6bff','#7fd6ff','#f4f1e6');w.fog=[0xe6f1f4,60,230];w.bounds=[-24,28,-4.6,15];w.spawn=V(4,0,12);w.yaw=0;w.face=Math.PI;w.camD=7;
 w.ground=(x,z)=>x>-18&&x<-10&&z<-3&&z>-6.4?Math.min(1.2,Math.floor((-3-z)/.8)*.3+.3):0;
 plane(w,500,500,0,-.05,0,0x2fa85a);plane(w,60,16,3,0,-2,0xb4684f);plane(w,70,7,0,.01,11.5,0x4a4a55);
 const WH=0xf4f6f8,BL=0x2d6bd6;box(w,36,9.5,7,6,0,-12,WH);box(w,37,.8,8,6,9.5,-12,BL);box(w,40,.4,2,6,.5,-8.2,0xe8dcc4,0,0);[1.4,4.5,7.6].forEach(y=>box(w,31,1.5,.1,7,y+.8,-8.45,0x23304d,0,0));
 box(w,7,13,7,-14,0,-10,WH);box(w,10,1,6,-12.6,8.5,-5.2,WH,1);box(w,2.2,1.3,.3,-14,8,-6.4,0x23304d,0,0);
 for(let x=-5;x<=17;x+=4.4)box(w,.55,8,.55,x,0,-8.2,0x8a4b2a);
 box(w,7,1.1,.5,-3,0,-3,0xd9a24a);box(w,7,1.1,.5,11,0,-3.4,0xd9a24a);for(let i=0;i<4;i++)box(w,6,.3*(i+1),.9,-14,0,-3.2-i*.8,0xe8e0d0,0,.01);
 box(w,16,8,9,40,0,-14,0xe8d9a8,0,.01);box(w,18,.6,10,40,8,-14,0xcdbf90,0,0);
 for(let i=0;i<70;i++){const a=rnd()*6.283,r=34+rnd()*45;tree(w,Math.cos(a)*r*1.1+2,Math.sin(a)*r-8,1.6+rnd()*1.5,[0x2fae5a,0x1f8f4a,0x46c46a][i%3])}
 [-20,24].forEach(x=>{for(let z=-1;z<12;z+=6)box(w,.15,4,.15,x,0,z,0x333344,0,0)});
 clouds(w,5,32,260);birds(w,5,6,16,-4,14,0xffffff);
 shard(w,22,1,3,'Under the leaves: a tiny pixel-art building.');
 const tm=beacon(w,-8,-1,0xff2a3d,'ACCESS TERMINAL',()=>w.onBeacon&&w.onBeacon());w.term=tm;return w};
// CH2 TRANSIT: globe cinematic (robot rides the signal along a great-circle route)
const rad=Math.PI/180,v3=(la,lo,r)=>V(-r*Math.sin((90-la)*rad)*Math.cos((lo+180)*rad),r*Math.cos((90-la)*rad),r*Math.sin((90-la)*rad)*Math.sin((lo+180)*rad));
WORLDS[1]=()=>{const w=W(),R0=10,tl=new T.TextureLoader();w.bg=new T.Color(0x0d0a2e);w.fog=null;w.bounds=[-1,1,-1,1];
 const em=new T.MeshPhongMaterial({map:tl.load('./assets/textures/earth_day.jpg'),emissiveMap:tl.load('./assets/textures/earth_lights.png'),emissive:0xffc880,shininess:18,specular:0x335577}),earth=new T.Mesh(new T.SphereGeometry(R0,64,48),em);w.g.add(earth);
 const atm=new T.Mesh(new T.SphereGeometry(R0*1.12,48,32),new T.ShaderMaterial({transparent:true,side:T.BackSide,blending:T.AdditiveBlending,depthWrite:false,vertexShader:'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 n;void main(){gl_FragColor=vec4(.2,.7,1.,1.)*pow(.65-dot(n,vec3(0,0,1.)),3.);}'}));w.g.add(atm);
 const st=[];for(let i=0;i<900;i++){const a=rnd()*6.283,b=Math.acos(2*rnd()-1),r=120+rnd()*60;st.push(r*Math.sin(b)*Math.cos(a),r*Math.cos(b),r*Math.sin(b)*Math.sin(a))}const sg=new T.BufferGeometry();sg.setAttribute('position',new T.Float32BufferAttribute(st,3));w.g.add(new T.Points(sg,new T.PointsMaterial({size:.9,color:0xfff4dc})));
 const C=window.CFG,A=v3(C.SF.lat,C.SF.lon,1).normalize(),Bv=v3(C.COLLEGE_COORDINATES.lat,C.COLLEGE_COORDINATES.lon,1).normalize(),om=Math.acos(A.dot(Bv)),P=[];
 for(let i=0;i<=240;i++){const t=i/240,p=A.clone().multiplyScalar(Math.sin((1-t)*om)/Math.sin(om)).add(Bv.clone().multiplyScalar(Math.sin(t*om)/Math.sin(om)));P.push(p.multiplyScalar(R0*1.012+1.6*Math.sin(Math.PI*t)))}
 const geo=new T.BufferGeometry().setFromPoints(P),line=new T.Line(geo,new T.LineBasicMaterial({color:0xff2e93}));geo.setDrawRange(0,0);w.g.add(line);
 const line2=new T.Line(geo,new T.LineBasicMaterial({color:0xffd23f,transparent:true,opacity:.6}));geo.setDrawRange(0,0);
 const mkr=(p,c)=>{const m=new T.Mesh(new T.SphereGeometry(.18,10,8),glow(c));m.position.copy(p);w.g.add(m);const r=new T.Mesh(new T.TorusGeometry(.5,.04,6,24),glow(c));r.position.copy(p);r.lookAt(0,0,0);w.g.add(r);w.ticks.push((dt,t)=>r.scale.setScalar(1+.35*Math.sin(t*4)))};mkr(P[0],0xffd23f);mkr(P[240],0x18d4c8);
 const sun=new T.DirectionalLight(0xffffff,1.3);sun.position.set(-40,25,40);w.g.add(sun);
 w.cine=done=>{G.S.mode='cine';const o={p:0},b=G.bot,cam=G.cam,txt=document.getElementById('cine');b.scale.setScalar(.35);b.visible=true;document.body.classList.add('hideui');txt.hidden=false;
  const set=t=>{txt.innerHTML=t};set('SAN FRANCISCO, USA.');G.sfx(200,1.5,'sawtooth',.05,900);
  const upd=()=>{const i=Math.min(239,Math.floor(o.p*240)),p=P[i],tg=P[i+1].clone().sub(P[Math.max(0,i-1)]).normalize(),n=p.clone().normalize(),d=THREE.MathUtils.lerp(16,7,Math.sin(Math.PI*Math.min(1,o.p*1.05)))+(o.p>.88?-(o.p-.88)*40:0);
   b.position.copy(p);b.up.copy(n);b.lookAt(p.clone().add(tg));cam.position.copy(n.clone().multiplyScalar(R0+d)).addScaledVector(tg,-d*.55);cam.up.set(0,1,0);cam.lookAt(p);geo.setDrawRange(0,i+1);
   if(o.p>.1&&o.p<.8&&txt.dataset.s!=='m'){txt.dataset.s='m';set('GLOBAL TRANSIT.<br><small>SAN FRANCISCO → GOA</small>')}if(o.p>=.8&&txt.dataset.s!=='g'){txt.dataset.s='g';set('GOA, INDIA.');G.sfx(700,.3,'triangle',.08)}};
  const upd0=w.cineTickOff;G.cineTick=()=>{};cam.fov=60;cam.updateProjectionMatrix();
  const fin=()=>{set('DESTINATION IDENTIFIED.<br>INDIA.<br>GOA.');G.sfx(880,.5,'triangle',.09,1320);setTimeout(()=>{txt.hidden=true;txt.dataset.s='';document.body.classList.remove('hideui');b.scale.setScalar(1);b.up.set(0,1,0);done()},2000)};
  w.tw=gsap.to(o,{p:1,duration:11,ease:'power1.inOut',onUpdate:upd,onComplete:fin});upd()};
 w.skip=()=>{w.tw&&w.tw.progress(1)};return w};
window.WORLDS=WORLDS;window.TERMINAL_COORDS=null;
})();
