(()=>{
// JOURNEY MODULE: GSAP ScrollTrigger timeline drives globe camera, routes, map crossfade and the six acts.
const acts=$$('.act'),S=Globe.S,C=Globe.CITIES,TOT=Math.round(Globe.km(C[0],C[8]));let curAct=-1,net=0;
const info=(t,d,n)=>{$('#pt').textContent=t;$('#pd').textContent=d;$('#pn').textContent=n||'';$('#panel').hidden=false};
$('#pc').onclick=()=>$('#panel').hidden=true;
Globe.onPick=i=>{const c=C[i],d=Math.round(Globe.km(C[0],c));info(c[0]+', '+c[1],Globe.fmt?Globe.fmt(c[2],c[3]):'',(i?d.toLocaleString()+' km from San Francisco (great-circle). ':'')+'Geographical reference only. No partnership is implied.')};
CityMap.onNode=n=>info(n[0],n[1],'Conceptual programme area. Not a venue location. Schedule provisional, subject to the Principal\'s approval.');
function showAct(p){const i=Math.min(5,Math.floor(p*6));if(i!==curAct){acts.forEach((a,k)=>a.classList.toggle('on',k===i));curAct=i}acts[5].classList.toggle('final',p>.93);$('#scrollhint').style.opacity=p<.03?1:0}
const go=y=>{const o={y:scrollY};gsap.to(o,{y,duration:2.2,ease:'power2.inOut',onUpdate:()=>scrollTo(0,o.y)})};
const at=a=>(document.documentElement.scrollHeight-innerHeight)*a/6;
if(Globe.ok){
  gsap.registerPlugin(ScrollTrigger);const A=[30,25];
  const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'#track',start:'top top',end:'bottom bottom',scrub:RM?true:.8,onUpdate:s=>showAct(s.progress)}});
  tl.fromTo(S,{dist:4.6,lon:-175,lat:20},{dist:1.75,lon:-122.4,lat:37.8,duration:1,ease:'power2.inOut'},0)                  // ACT 1
    .to(S,{dist:3.5,lon:A[0],lat:A[1],lit:9,net:1,duration:1},1)                                                         // ACT 2: full Earth, cities lit, routes drawn
    .to(S,{u:1,main:1,dist:2.2,duration:1,onUpdate(){const u=S.u,w=Math.min(1,u/.2),e=w*w*(3-2*w),g=Globe.gc(C[0],C[8],u);S.lon=A[0]+(g[1]-A[0])*e;S.lat=A[1]+(g[0]-A[1])*e;
        $('#dist').textContent=`${Math.round(TOT*u).toLocaleString()} KM OF ${TOT.toLocaleString()} KM · SAN FRANCISCO → GOA (GREAT-CIRCLE)`}},2)  // ACT 3: camera follows route
    .to(S,{lon:77,lat:20,dist:1.5,fin:1,duration:1,ease:'power2.inOut'},3)                                               // ACT 4: India + final routes
    .to(S,{lon:73.83,lat:15.49,dist:1.03,mapMix:1,duration:1,ease:'power2.in',onUpdate(){if(S.mapMix>.15)CityMap.init();const m=Math.max(0,Math.min(1,(S.mapMix-.55)/.35)),el=$('#map');el.style.opacity=m;el.classList.toggle('on',m>.9);
        CityMap.set({zoom:8.5+4.5*m,pitch:0,net:0})}},4)                                                                    // ACT 5: globe -> Panaji map
    .to(S,{net2:1,duration:1,onUpdate(){const p=this.progress();CityMap.set({zoom:13+.8*p,pitch:52*p,bearing:-25*p,net:Math.min(1,p*1.4)})}},5);          // ACT 6: network emerges
  $('#begin').onclick=()=>go(at(1.05));$('#explore').onclick=()=>info('THE SUMMIT','AI Summit, Intercollegiate Hackathon, Practical Workshops, Four Parallel Competitions, International Research Talks and a Small Business × Student Workshop.','Hackathon: Day 1 and Day 2. Schedule provisional, subject to the Principal\'s approval.');
  $('#reset').onclick=()=>{if(S.mapMix>0||S.main>0||!Globe.free)go(at(1.5));Globe.free=false;if(Globe.free===false&&S.mapMix===0)Globe.reset()};
  $('#zin').onclick=()=>Globe.zoom(-.25);$('#zout').onclick=()=>Globe.zoom(.25);
  const loop=()=>{Globe.frame();requestAnimationFrame(loop)};loop();showAct(0);
}else{acts.forEach(a=>a.classList.add('on'));$('#begin').onclick=()=>$('[data-a="1"]').scrollIntoView();$('#explore').onclick=()=>info('THE SUMMIT','AI Summit, Intercollegiate Hackathon, Practical Workshops, Four Parallel Competitions, International Research Talks and a Small Business × Student Workshop.','Hackathon: Day 1 and Day 2. Schedule provisional.')}

})();
