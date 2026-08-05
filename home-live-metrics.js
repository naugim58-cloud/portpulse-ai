/* Keep overview metrics in sync with the active mode and live congestion model. */
(function(){
  const refresh=()=>{
    if(typeof route==='undefined'||route!=='home'||typeof ports==='undefined'||!ports.length||typeof congestionScore!=='function')return;
    const scores=ports.map((_,i)=>congestionScore(i));
    const avg=Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
    const wait=Math.round(ports.reduce((a,p)=>a+(Number(p[5])||0),0)/ports.length);
    const vessels=ports.reduce((a,p)=>a+(Number(p[4])||0),0);
    const metrics=document.querySelectorAll('.metrics .metric');
    if(metrics[0]){const value=metrics[0].querySelector('.value');if(value)value.innerHTML=`${avg} <small>/ 100</small>`;const trend=metrics[0].querySelector('.trend');if(trend)trend.textContent='현재 데이터 기준'}
    if(metrics[2]){const value=metrics[2].querySelector('.value');if(value)value.innerHTML=`${wait} <small>분</small>`;const trend=metrics[2].querySelector('.trend');if(trend)trend.textContent='현재 항만 평균'}
    if(metrics[3]){const value=metrics[3].querySelector('.value');if(value)value.innerHTML=`${vessels} <small>척</small>`;const trend=metrics[3].querySelector('.trend');if(trend)trend.textContent='현재 모니터링 항만 기준'}
  };
  refresh();
  setInterval(refresh,30000);
})();
