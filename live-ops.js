/* The API key stays in GitHub Actions; the browser reads only this sanitized snapshot. */
(function () {
  const aliases = {'부산신항':['부산신항','신항'],'북항':['북항'],'감천항':['감천항'],'다대포항':['다대포항'],'남항':['남항']};
  const destinationPort = (name) => Object.keys(aliases).find((port) => aliases[port].some((alias) => String(name || '').includes(alias))) || '';
  const portFor = (name) => Object.keys(aliases).find((port) => aliases[port].some((alias) => String(name || '').includes(alias))) || (String(name || '').includes('부산') ? '부산항 관제권' : '');
  const isCruise = (v) => /크루즈|cruise|여객|터미널|ferry|passenger|of the seas|spectrum|voyager|oasis|quantum/i.test((v || []).join(' '));
  const format = (value) => { const d = String(value || '').replace(/[^0-9]/g, ''); return d.length >= 12 ? d.slice(4, 8) + ' ' + d.slice(8, 10) + ':' + d.slice(10, 12) : '실시간 확인'; };
  const applyData=(data)=>{
    if (!data || !Array.isArray(data.records) || !data.records.length || typeof ships === 'undefined') return;
    const liveShips = data.records.map((v) => { const destination = v.destinationPort || v.nextPort || '목적지 확인 필요'; const port = portFor(v.portName); return port ? [v.vesselName || '선박명 미상', port, v.departurePort || '출발지 미상', format(v.entryAt || v.expectedDepartureAt), '실시간', destination] : null; }).filter(Boolean);
    if (!liveShips.length) {
      if (activeMode && typeof ships !== 'undefined') {
        ships.splice(0, ships.length, ...(activeMode === 'tourism' ? [['부산 관광 목적지 데이터 없음','관광 모드','부산 항만 목적지가 명시된 선박 없음','실시간 확인','-']] : [['부산 물류 목적지 데이터 없음','물류 모드','부산 항만 목적지가 명시된 선박 없음','실시간 확인','-']]));
        if (typeof render === 'function') render();
      }
      return;
    }
    window.liveEtaShips = liveShips;
    const allowedPorts = activeMode === 'tourism' ? ['북항','다대포항','영도 크루즈터미널','부산항 관제권'] : ['부산신항','북항','감천항','남항','부산항 관제권'];
    const allowed = !activeMode ? liveShips : liveShips.filter(v => allowedPorts.includes(v[1]) && (activeMode === 'tourism' ? isCruise(v) : !isCruise(v)));
    if (activeMode && !allowed.length) { ships.splice(0, ships.length, ...(activeMode === 'tourism' ? [['크루즈 선박 데이터 없음','관광 모드','공개 API에 크루즈 유형 기록 없음','실시간 확인','-']] : [['물류 선박 데이터 없음','물류 모드','공개 API에 운항 기록 없음','실시간 확인','-']])); if (typeof render === 'function') render(); return; }
    ships.splice(0, ships.length, ...(allowed.length ? allowed : liveShips));
    if (typeof render === 'function') render();
    document.documentElement.dataset.liveOps = 'ready';
    document.documentElement.dataset.liveOpsUpdated = data.updatedAt || '';
  };
  const refresh=()=>fetch('assets/live-vessel-data.json?ts=' + Date.now(), {cache:'no-store'}).then((r) => r.ok ? r.json() : null).then(applyData).catch(() => {});
  window.refreshLiveEtaData=refresh;
  refresh();
  window.addEventListener('portpulse:mode',refresh);
})();
