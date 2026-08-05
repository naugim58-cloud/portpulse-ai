(function(){
  let liveRecords=[];
  const aliases={부산신항:['부산신항','신항'],북항:['북항','부산'],감천항:['감천항'],다대포항:['다대포항'],남항:['남항']};
  const portOf=name=>Object.keys(aliases).find(p=>aliases[p].some(a=>String(name||'').includes(a)))||'';
  const timeOf=v=>{const d=String(v||'').replace(/[^0-9]/g,'');return d.length>=12?`${d.slice(4,8)} ${d.slice(8,10)}:${d.slice(10,12)}`:'실시간 확인';};
  fetch('assets/live-vessel-data.json?alerts='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():null).then(data=>{liveRecords=Array.isArray(data?.records)?data.records:[];if(typeof route!=='undefined'&&route==='alerts'&&typeof render==='function')render()}).catch(()=>{});
  window.alerts=function(){
    const watched=(typeof ports!=='undefined'?ports:[]).map((p,i)=>({p,i})).filter(x=>typeof isFavorite==='function'&&isFavorite(x.p[0]));
    if(!watched.length)return `<div class="page">${head('ALERTS','알림 센터','즐겨찾기 항만의 실제 데이터 변화만 표시합니다.')}<div class="card"><h2>즐겨찾기 항만 알림</h2><div class="favorites-empty">항만 화면에서 ★를 눌러 즐겨찾기하면 실제 혼잡도와 입항 선박 알림이 표시됩니다.</div></div></div>`;
    const rows=watched.map(({p,i})=>{const score=congestionScore(i),tone=congestionTone(score),validNames=new Set((window.liveEtaShips||[]).filter(v=>v[1]===p[0]).map(v=>v[0])),records=liveRecords.filter(r=>validNames.has(r.vesselName));const recordRows=records.slice(0,6).map(r=>'<div class="alert"><span class="badge yellow">◎</span><div><strong>'+(r.vesselName||'선박명 미상')+' 입항 정보</strong><small>'+p[0]+' · '+(r.entryType||'운항 기록')+' · 예정 '+timeOf(r.entryAt||r.expectedDestinationEntryAt||r.expectedDepartureAt)+'</small></div><small>AIS/API</small></div>').join('');return '<div class="alert"><span class="badge '+tone+'">'+(score>=51?'↗':'◉')+'</span><div><strong>'+p[0]+' 혼잡도 '+score+'점</strong><small>현재 상태 '+congestionStatus(score)+' · 평균 대기 '+p[5]+'분 · 실제 API 기반</small></div><small>실시간</small></div>'+recordRows}).join('');
    return `<div class="page">${head('ALERTS','알림 센터','즐겨찾기 항만의 실제 데이터 변화만 표시합니다.')}<div class="card"><div class="favorites-head"><div><h2>실시간 항만 알림</h2><div class="sub">누적 AIS·입출항 API 스냅샷 기준</div></div><span class="badge green">${watched.length}개 항만</span></div><div class="alerts">${rows}</div></div></div>`;
  };
})();
