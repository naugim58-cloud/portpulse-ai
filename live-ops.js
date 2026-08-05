/* The API key stays in GitHub Actions; the browser reads only this sanitized snapshot. */
(function () {
  const aliases = {'부산신항':['부산신항','신항'],'북항':['북항','부산항'],'감천항':['감천항'],'다대포항':['다대포항'],'남항':['남항']};
  const portFor = (name) => Object.keys(aliases).find((port) => aliases[port].some((alias) => String(name || '').includes(alias))) || '';
  const format = (value) => { const d = String(value || '').replace(/[^0-9]/g, ''); return d.length >= 12 ? d.slice(4, 8) + ' ' + d.slice(8, 10) + ':' + d.slice(10, 12) : (value || '실시간 확인'); };
  fetch('assets/live-vessel-data.json?ts=' + Date.now(), {cache:'no-store'}).then((r) => r.ok ? r.json() : null).then((data) => {
    if (!data || !Array.isArray(data.records) || !data.records.length || typeof ships === 'undefined') return;
    const liveShips = data.records.map((v) => { const port = portFor(v.portName); return port ? [v.vesselName || '선박명 미상', port, v.departurePort || '부산항 관제권', format(v.entryAt || v.expectedDepartureAt), '실시간'] : null; }).filter(Boolean);
    if (!liveShips.length) return;
    ships.splice(0, ships.length, ...liveShips);
    if (typeof render === 'function') render();
    document.documentElement.dataset.liveOps = 'ready';
    document.documentElement.dataset.liveOpsUpdated = data.updatedAt || '';
  }).catch(() => {});
})();
