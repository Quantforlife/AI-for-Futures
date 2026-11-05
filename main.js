// Canvas network atlas (no tiles, so nothing to fail), scroll scenes, nav, cursor.
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches,MOB=innerWidth<700;
const cv=$('#map'),x=cv.getContext('2d');let W,H,dpr=Math.min(devicePixelRatio||1,2);
const city=[['San Francisco',-122.4,37.8],['Seattle',-122.3,47.6],['London',-.12,51.5],['Paris',2.35,48.9],['Berlin',13.4,52.5],['Bengaluru',77.6,13],['Mumbai',72.9,19.1],['New Delhi',77.2,28.6],['Goa',74,15.5]];
const K=[[10,25,1],[-20,35,1.1],[76,20,5],[74,15.5,16],[74,15.5,10],[74,15.5,8],[74,15.5,6],[74,15.5,12]]; // lon, lat, zoom per scene
const rnd=[...Array(MOB?50:140)].map(()=>[Math.random()*360-180,Math.random()*140-60,Math.random()]);
let t=0,tt=0,cam=K[0].slice();
function size(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;x&&x.setTransform(dpr,0,0,dpr,0,0)}addEventListener('resize',size);size();
const P=(lo,la)=>{const s=W/360*cam[2];return[(lo-cam[0])*s+W/2,-(la-cam[1])*s+H/2]};
const ease=v=>v*v*(3-2*v);
function frame(ms){
  tt=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*7;t+=RM?(tt-t):(tt-t)*.08;
  const i=Math.min(6,Math.floor(t)),f=ease(t-i);for(let k=0;k<3;k++)cam[k]=K[i][k]+(K[i+1][k]-K[i][k])*f;
  x.clearRect(0,0,W,H);x.lineWidth=1;x.strokeStyle='#287bff22';
  for(let lo=-180;lo<=180;lo+=15){const[a,b]=P(lo,-80),[c,d]=P(lo,80);x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke()}
  for(let la=-75;la<=75;la+=15){const[a,b]=P(-180,la),[c,d]=P(180,la);x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke()}
  rnd.forEach(r=>{const[a,b]=P(r[0],r[1]);x.fillStyle=`rgba(0,229,255,${.15+.25*Math.abs(Math.sin(ms/1500+r[2]*9))})`;x.fillRect(a,b,1.6,1.6)});
  const g=P(74,15.5),vis=t>=.6?1:t/.6,pulse=(ms/1800)%1;
  city.forEach((c,n)=>{if(n===8||vis<=0)return;const[a,b]=P(c[1],c[2]);
    const mx=(a+g[0])/2,my=(b+g[1])/2-Math.hypot(a-g[0],b-g[1])*.22;x.strokeStyle=`rgba(40,123,255,${.5*vis})`;x.beginPath();x.moveTo(a,b);x.quadraticCurveTo(mx,my,g[0],g[1]);x.stroke();
    const q=(pulse+n/9)%1,px=(1-q)**2*a+2*(1-q)*q*mx+q*q*g[0],py=(1-q)**2*b+2*(1-q)*q*my+q*q*g[1];x.fillStyle='#00e5ff';x.fillRect(px-1.5,py-1.5,3,3)});
  city.forEach(c=>{const[a,b]=P(c[1],c[2]),goa=c[0]==='Goa';x.fillStyle=goa?'#00e5ff':'#fff';x.beginPath();x.arc(a,b,goa?4:2.5,0,7);x.fill();
    if(goa||cam[2]<3.5){x.fillStyle='#8b929e';x.font='11px sans-serif';x.fillText(c[0],a+8,b+4)}});
  if(t>2.4){const r=((ms/1500)%1)*60*Math.min(1,t-2.4);x.strokeStyle=`rgba(0,229,255,${1-r/60})`;x.beginPath();x.arc(g[0],g[1],r+6,0,7);x.stroke()}
  $('#bar').style.width=Math.min(100,tt/7*100)+'%';requestAnimationFrame(frame)}
if(x){$('.fallback').style.display='none';requestAnimationFrame(frame)}else cv.style.display='none'; // fallback gradient stays if canvas unavailable
const io=new IntersectionObserver(e=>e.forEach(n=>n.isIntersecting&&n.target.classList.add('in')),{threshold:.25});$$('.scene').forEach(s=>io.observe(s));
const bg=$('.burger'),nv=$('#links');bg.onclick=()=>bg.setAttribute('aria-expanded',nv.classList.toggle('open'));nv.onclick=()=>{nv.classList.remove('open');bg.setAttribute('aria-expanded','false')};
const cur=$('#cur');addEventListener('pointermove',e=>{cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px'});
