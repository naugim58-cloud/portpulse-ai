const realPortCoords={
 '부산신항':[35.0768,128.7684],
 '북항':[35.1124,129.0436],
 '감천항':[35.0525,129.0007],
 '다대포항':[35.0478,128.9668],
 '남항':[35.0796,129.0337],
 '영도 크루즈터미널':[35.0894,129.0524]
};
function realMapPopup(i){const p=ports[i],score=congestionScore(i);return `<div class="leaflet-popup-title">${p[0]}</div><div class="leaflet-popup-score ${congestionTone(score)}">${score} / 100 · ${congestionStatus(score)}</div><div class="leaflet-popup-meta">평균 대기 ${p[5]}분 · 대기 선박 ${p[4]}척</div>`}
function mountRealMaps(){if(typeof L==='undefined')return;document.querySelectorAll('.main-map-shell').forEach((shell)=>{if(shell.querySelector('.leaflet-map'))return;const mapHost=document.createElement('div');mapHost.className='leaflet-map';shell.appendChild(mapHost);const map=L.map(mapHost,{zoomControl:true,scrollWheelZoom:false}).setView([35.105,129.015],11.7);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors',maxZoom:19}).addTo(map);const coords=ports.map(p=>realPortCoords[p[0]]);ports.forEach((p,i)=>{const score=congestionScore(i),tone=congestionTone(score),icon=L.divIcon({className:'port-marker-wrap',html:`<span class="port-marker ${tone}"><i></i></span>`,iconSize:[24,24],iconAnchor:[12,12]});const marker=L.marker(coords[i],{icon}).addTo(map).bindPopup(realMapPopup(i));marker.on('click',()=>{const panel=document.getElementById('basic-port-panel');if(panel&&typeof basicPortCard==='function'){panel.hidden=false;panel.innerHTML=basicPortCard(i);const detail=panel.querySelector('[data-detail-port]');if(detail)detail.onclick=()=>{selectedPort=i;route='port-detail';render()};panel.scrollIntoView({behavior:'smooth',block:'nearest'})}})});const svg=shell.querySelector('.busan-map');if(svg)svg.style.display='none';const tooltip=shell.querySelector('.map-tooltip');if(tooltip)tooltip.style.display='none';setTimeout(()=>map.invalidateSize(),0)})}
const realMapBaseRender=render;render=function(){realMapBaseRender();setTimeout(mountRealMaps,0)};setTimeout(mountRealMaps,0);
