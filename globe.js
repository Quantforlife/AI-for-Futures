// GLOBE MODULE: Three.js earth, atmosphere, markers, curved routes, orbit camera. Exposes window.Globe.
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const MOB=matchMedia('(max-width:700px)').matches,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const CITIES=[['San Francisco','USA',37.7749,-122.4194],['Seattle','USA',47.6062,-122.3321],['London','UK',51.5072,-0.1276],['Paris','France',48.8566,2.3522],['Berlin','Germany',52.52,13.405],['Bengaluru','India',12.9716,77.5946],['Mumbai','India',19.076,72.8777],['New Delhi','India',28.6139,77.209],['Goa (Panaji)','India',15.4909,73.8278]];
const ROUTES=[[0,1],[0,2],[2,3],[3,4],[4,7],[7,6],[6,8],[5,8]]; // network routes; main SF->Goa route is separate
const S={lon:-170,lat:20,dist:4.6,lit:0,net:0,main:0,fin:0,u:0,mapMix:0,net2:0};
const Globe={S,CITIES,ok:false,onPick:null};window.Globe=Globe;
const rad=Math.PI/180,v3=(la,lo,r=1)=>{const p=(90-la)*rad,t=(lo+180)*rad;return new THREE.Vector3(-r*Math.sin(p)*Math.cos(t),r*Math.cos(p),r*Math.sin(p)*Math.sin(t))};
const km=(a,b)=>{const h=Math.sin((b[2]-a[2])*rad/2)**2+Math.cos(a[2]*rad)*Math.cos(b[2]*rad)*Math.sin((b[3]-a[3])*rad/2)**2;return 12742*Math.asin(Math.sqrt(h))};
function gcPts(a,b,n=90,lift=.12){const A=v3(a[2],a[3]).normalize(),B=v3(b[2],b[3]).normalize(),w=Math.acos(Math.min(1,A.dot(B))),o=[];
  for(let i=0;i<=n;i++){const t=i/n,p=A.clone().multiplyScalar(Math.sin((1-t)*w)/Math.sin(w)).add(B.clone().multiplyScalar(Math.sin(t*w)/Math.sin(w)));o.push(p.multiplyScalar(1.004+lift*Math.sin(Math.PI*t)*Math.min(1,w)))}return o}
Globe.gc=(a,b,u)=>{const p=gcPts(a,b,200,0)[Math.round(u*200)].normalize();return[Math.asin(p.y)/rad,Math.atan2(p.z,-p.x)/rad-180+(Math.atan2(p.z,-p.x)/rad-180<-180?360:0)]};
Globe.km=km;
try{
  const cv=$('#globe'),R=new THREE.WebGLRenderer({canvas:cv,antialias:!MOB,alpha:true});if(!R.getContext())throw 0;
  R.setPixelRatio(Math.min(devicePixelRatio,MOB?1.5:2));const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,1,.01,50);
  const tl=new THREE.TextureLoader(),sun=new THREE.Vector3(),U={day:{value:null},night:{value:null},sun:{value:sun},has:{value:0}};
  tl.load('./assets/earth_day.jpg',t=>{t.anisotropy=4;U.day.value=t;U.has.value=1},undefined,()=>{}); // if textures fail the globe still renders (dark blue)
  tl.load('./assets/earth_lights.png',t=>{U.night.value=t});
  const earth=new THREE.Mesh(new THREE.SphereGeometry(1,MOB?64:128,MOB?48:96),new THREE.ShaderMaterial({uniforms:U,
   vertexShader:'varying vec2 vU;varying vec3 vN;void main(){vU=uv;vN=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'uniform sampler2D day,night;uniform vec3 sun;uniform float has;varying vec2 vU;varying vec3 vN;void main(){float d=dot(vN,normalize(sun));float m=smoothstep(-.12,.3,d);vec3 c=has>.5?texture2D(day,vU).rgb:vec3(.02,.06,.15);vec3 l=texture2D(night,vU).rgb*vec3(1.,.8,.5)*1.6;vec3 col=c*(.06+m*1.05)+l*(1.-m);col+=vec3(.0,.35,.7)*pow(1.-abs(d),6.)*.06;gl_FragColor=vec4(col,1.);}'}));sc.add(earth);
  const atm=new THREE.Mesh(new THREE.SphereGeometry(1.14,64,48),new THREE.ShaderMaterial({transparent:true,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false,
   vertexShader:'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'varying vec3 n;void main(){float i=pow(.62-dot(n,vec3(0,0,1.)),3.);gl_FragColor=vec4(.1,.55,1.,1.)*i;}'}));sc.add(atm);
  const sp=[];for(let i=0;i<(MOB?600:1800);i++){const v=new THREE.Vector3().randomDirection?0:0;const a=Math.random()*6.283,b=Math.acos(2*Math.random()-1),r=20+Math.random()*15;sp.push(r*Math.sin(b)*Math.cos(a),r*Math.cos(b),r*Math.sin(b)*Math.sin(a))}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));sc.add(new THREE.Points(sg,new THREE.PointsMaterial({size:.06,color:0x9fb4d8,sizeAttenuation:true,transparent:true,opacity:.7})));
  // glow sprite texture
  const gc2=document.createElement('canvas');gc2.width=gc2.height=64;const g=gc2.getContext('2d'),gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(0,229,255,1)');gr.addColorStop(.3,'rgba(0,229,255,.35)');gr.addColorStop(1,'rgba(0,229,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);const gtex=new THREE.CanvasTexture(gc2);
  const mk=CITIES.map((c,i)=>{const p=v3(c[2],c[3],1.006),grp=new THREE.Group();grp.position.copy(p);
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(.009,12,12),new THREE.MeshBasicMaterial({color:i==8?0x00e5ff:0xffffff})));
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:gtex,blending:THREE.AdditiveBlending,depthWrite:false}));s.scale.setScalar(i==8?.14:.09);grp.add(s);
    const hit=new THREE.Mesh(new THREE.SphereGeometry(.045,8,8),new THREE.MeshBasicMaterial({visible:false}));hit.userData.i=i;grp.add(hit);grp.scale.setScalar(.001);earth.add(grp);
    const el=document.createElement('div');el.className='lb';el.textContent=c[0].toUpperCase();$('#labels').appendChild(el);return{grp,hit,el,p}});
  const ln=(pts,col)=>{const geo=new THREE.BufferGeometry().setFromPoints(pts),l=new THREE.Line(geo,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false}));l.userData.n=pts.length;geo.setDrawRange(0,0);earth.add(l);return l};
  const rl=ROUTES.map(([a,b],i)=>ln(gcPts(CITIES[a],CITIES[b]),i%2?0x8a2be2:0x00e5ff)),main=ln(gcPts(CITIES[0],CITIES[8],160,.16),0x00e5ff),fin=[7,6,5].map(i=>ln(gcPts(CITIES[i],CITIES[8],60,.05),0x8a2be2));
  const draw=(l,f)=>l.geometry.setDrawRange(0,Math.floor(l.userData.n*Math.max(0,Math.min(1,f))));
  const rc=new THREE.Raycaster(),ms=new THREE.Vector2();let dn=null,pts=new Map(),pd=0,moved=0;
  function size(){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}addEventListener('resize',size);size();
  cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);dn=[e.clientX,e.clientY];moved=0;pd=pts.size>1?Math.hypot(...[...pts.values()].reduce((a,b)=>[a[0]-b[0],a[1]-b[1]])):0;cv.style.cursor='grabbing'});
  cv.addEventListener('pointermove',e=>{const p=pts.get(e.pointerId);if(!p)return;const dx=e.clientX-p[0],dy=e.clientY-p[1];pts.set(e.pointerId,[e.clientX,e.clientY]);moved+=Math.abs(dx)+Math.abs(dy);
    if(pts.size==2){const v=[...pts.values()],d=Math.hypot(v[0][0]-v[1][0],v[0][1]-v[1][1]);if(pd)Globe.zoom((pd-d)*.006);pd=d;return}
    const k=.28*(S.dist-.9)/innerHeight*200/3;S.lon-=dx*k*.5*.9;S.lat=Math.max(-85,Math.min(85,S.lat+dy*k*.5*.9));Globe.free=true});
  const up=e=>{pts.delete(e.pointerId);cv.style.cursor='grab';if(dn&&moved<6){ms.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);rc.setFromCamera(ms,cam);const h=rc.intersectObjects(mk.map(m=>m.hit))[0];if(h&&Globe.onPick)Globe.onPick(h.object.userData.i)}dn=null};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);cv.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey){e.preventDefault();Globe.zoom(e.deltaY*.004)}},{passive:false}); // plain wheel scrolls the journey; Ctrl/Cmd+wheel or +/- buttons zoom
  Globe.zoom=d=>{S.dist=Math.max(1.05,Math.min(6,S.dist*(1+d)));Globe.free=true};
  Globe.reset=()=>{Globe.free=false;S.mapMix=S.mapMix;gsap.to(S,{lon:20,lat:20,dist:3.4,duration:1.6,ease:'power2.inOut'})};
  const fmt=(la,lo)=>`${Math.abs(la).toFixed(4)}° ${la<0?'S':'N'}, ${Math.abs(lo%360>180?lo%360-360:lo).toFixed(4)}° ${(lo%360>180?lo%360-360:lo)<0?'W':'E'}`;
  Globe.fmt=fmt;let vis=true;
  Globe.frame=()=>{if(!vis)return;
    cam.position.copy(v3(S.lat,S.lon,S.dist));cam.up.set(0,1,0);cam.lookAt(0,0,0);sun.copy(cam.position).add(new THREE.Vector3(-.9,.5,.2)).normalize();
    const f=Math.max(0,1-S.mapMix*1.2);cv.style.opacity=Math.min(1,f);mk.forEach((m,i)=>{const s=Math.max(.001,Math.min(1,S.lit-i));m.grp.scale.setScalar(s*(i==8?1+.25*Math.sin(performance.now()/350):1));
      const w=m.p.clone().applyMatrix4(earth.matrixWorld),front=w.clone().normalize().dot(cam.position.clone().normalize())>.25,pr=w.project(cam);
      m.el.style.opacity=front&&s>.9&&S.dist<4.2?1:0;m.el.style.transform=`translate(${(pr.x*.5+.5)*innerWidth+10}px,${(-pr.y*.5+.5)*innerHeight-6}px)`});
    rl.forEach((l,i)=>draw(l,S.net*rl.length-i));draw(main,S.main);fin.forEach((l,i)=>draw(l,S.fin*3-i));R.render(sc,cam);$('#hud').textContent=fmt(S.lat,S.lon)};
  new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(cv);
  Globe.ok=true;
}catch(err){console.warn('3D globe unavailable, using fallback',err);document.documentElement.classList.add('nogl')}
