/* Predict ETA from the latest vessel snapshot when the public feed has no ETA field. */
(function(){
  const pad=n=>String(n).padStart(2,'0');
  const clock=d=>`${pad(d.getMonth()+1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const duration=m=>{m=Math.max(0,Math.round(m));return `${Math.floor(m/60)}h ${pad(m%60)}m`};
  const distanceFromText=text=>{
    const m=String(text||'').match(/(\d+(?:\.\d+)?)\s*nm/i);
    if(m)return Number(m[1]);
    const t=String(text||'').toLowerCase();
    if(/shanghai|상하이/.test(t))return 420;
    if(/ulsan|울산/.test(t))return 42;
    if(/busan|부산|항만 관제권/.test(t))return 18;
    return 65;
  };
  const predict=v=>{
    const portIndex=typeof ports!=='undefined'?ports.findIndex(p=>p[0]===v[1]):-1;
    const wait=portIndex>=0&&typeof congestionScore==='function'?Math.max(10,Number(ports[portIndex][5])||Math.round(congestionScore(portIndex)*1.2)):30;
    const speed=14.2;
    const sailing=Math.round(distanceFromText(v[2])/speed*60);
    const now=new Date(),base=new Date(now.getTime()+sailing*60000),adjusted=new Date(base.getTime()+wait*60000);
    return {base:clock(base),eta:clock(adjusted),wait:duration(wait)};
  };
  window.predictVesselEta=predict;
  if(typeof etaPage!=='function')return;
  const baseEtaPage=etaPage;
  etaPage=function(){
    const snapshots=ships.map(v=>({v,old:v[3],oldWait:v[4]}));
    snapshots.forEach(({v})=>{const p=predict(v);v[3]=p.eta;v[4]=p.wait;v.__baseEta=p.base});
    let html=baseEtaPage();
    const selectedShip=ships[selected];
    if(selectedShip&&selectedShip.__baseEta)html=html.replace(/08\.04 16:30/g,selectedShip.__baseEta).replace('현재 위치와 항만 혼잡도를 반영한 실제 입항 예상시간입니다.','현재 위치와 항만 혼잡도를 반영한 예측 입항 예상시간입니다.').replace('혼잡도 반영 실제 입항','혼잡도 반영 예측 입항');
    return html;
  };
  setInterval(()=>{if(typeof route!=='undefined'&&route==='eta'&&typeof render==='function')render()},60000);
})();
