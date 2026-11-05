// CITY MAP MODULE: MapLibre over token-free Esri World Imagery, lazy-initialised. Nodes are conceptual, NOT venues.
const PAN=[73.8278,15.4909];
const NODES=[['AI SUMMIT','Speaker sessions, research talks and international discussions.',[-.045,.028]],['HACKATHON','A two-day intercollegiate challenge beginning on Day 1 and continuing on Day 2.',[.038,.03]],['WORKSHOPS','Practical AI learning and technology sessions.',[-.05,-.022]],['INNOVATION','Four parallel competitions in AI reel-making, prompt engineering, AI poster-making and AI design.',[.045,-.02]],['SMALL BUSINESS INNOVATION','Connecting local business problems with student-built AI solutions.',[0,-.048]]];
const CityMap={map:null,ok:null,ready:false,init(){if(this.ok!==null)return;try{
  const m=this.map=new maplibregl.Map({container:'map',center:PAN,zoom:9,pitch:0,interactive:false,attributionControl:false,fadeDuration:0,
   style:{version:8,sources:{sat:{type:'raster',tileSize:256,maxzoom:18,tiles:['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],attribution:'Imagery © Esri, Maxar, Earthstar Geographics'}},layers:[{id:'bg',type:'background',paint:{'background-color':'#050609'}},{id:'sat',type:'raster',source:'sat',paint:{'raster-brightness-max':.62,'raster-saturation':-.25,'raster-contrast':.15}}]}});
  m.addControl(new maplibregl.AttributionControl({compact:true}),'bottom-left');
  const pt=NODES.map(n=>[PAN[0]+n[2][0],PAN[1]+n[2][1]]);
  m.on('load',()=>{const lines=[];pt.forEach((p,i)=>{lines.push([PAN,p]);lines.push([p,pt[(i+1)%5]])});
    m.addSource('net',{type:'geojson',data:{type:'MultiLineString',coordinates:lines}});
    m.addLayer({id:'glow',type:'line',source:'net',paint:{'line-color':'#00e5ff','line-width':7,'line-blur':6,'line-opacity':0}});m.addLayer({id:'core',type:'line',source:'net',paint:{'line-color':'#8ff5ff','line-width':1.2,'line-opacity':0}});this.ready=true;this.set(this.last||{})});
  m.on('error',e=>{if(!this.ready&&e&&e.error&&!/tile|404/i.test(e.error.message||''))console.warn(e.error)});
  const el=(t,c)=>{const d=document.createElement(t);d.className=c;return d};
  const lab=(txt,ll)=>{const d=el('div','mlab');d.textContent=txt;new maplibregl.Marker({element:d}).setLngLat(ll).addTo(m)};
  lab('PANAJI',PAN);lab('MANDOVI RIVER (APPROX.)',[73.8415,15.5045]);
  this.nodes=NODES.map((n,i)=>{const b=el('button','node');b.textContent=n[0];b.style.opacity=0;b.style.pointerEvents='none';b.onclick=()=>CityMap.onNode&&CityMap.onNode(n);new maplibregl.Marker({element:b}).setLngLat(pt[i]).addTo(m);return b});
  this.ok=true}catch(e){console.warn('City map unavailable',e);this.ok=false}},
 set(o){this.last=o;if(!this.ok||!this.map)return;const m=this.map;m.jumpTo({center:PAN,zoom:o.zoom,pitch:o.pitch||0,bearing:o.bearing||0});
  if(this.ready){m.setPaintProperty('glow','line-opacity',.55*o.net);m.setPaintProperty('core','line-opacity',.9*o.net)}
  this.nodes&&this.nodes.forEach((b,i)=>{const v=Math.max(0,Math.min(1,o.net*5-i*.8));b.style.opacity=v;b.style.pointerEvents=v>.8?'auto':'none'})}};
