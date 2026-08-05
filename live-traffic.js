/* MTIS live marine traffic snapshot. The API key stays in GitHub Actions. */
(function () {
  const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
  const num = (v) => { const n = Number(String(v ?? '').replace(/[% ,]/g, '')); return Number.isFinite(n) ? n : null; };
  const distance = (a, b) => Math.hypot((a[0] - b[0]) * 1.15, a[1] - b[1]);
  const apply = (traffic) => {
    if (!traffic || !Array.isArray(traffic.records) || !traffic.records.length || typeof congestionScore !== 'function') return;
    const baseScore = congestionScore;
    const points = traffic.records.map((r) => ({ lat: num(r.latitude), lon: num(r.longitude), density: num(r.density), count: num(r.vesselCount) })).filter((r) => r.density !== null || r.count !== null);
    if (!points.length) return;
    const maxCount = Math.max(1, ...points.map((r) => r.count || 0));
    const portCoords = typeof realPortCoords !== 'undefined' ? realPortCoords : {};
    const liveForPort = (name) => { const c = portCoords[name]; const nearby = c ? points.filter((r) => r.lat !== null && r.lon !== null && distance([r.lat, r.lon], c) < 0.12) : points; const list = nearby.length ? nearby : points; const values = list.map((r) => r.density !== null ? r.density : ((r.count || 0) / maxCount) * 100); return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null; };
    window.liveTraffic = traffic; window.liveTrafficScores = {};
    (typeof ports !== 'undefined' ? ports : []).forEach((p, i) => { const live = liveForPort(p[0]); if (live !== null) window.liveTrafficScores[i] = clamp(baseScore(i) * 0.65 + live * 0.35); });
    window.congestionScore = (i) => Object.prototype.hasOwnProperty.call(window.liveTrafficScores, i) ? window.liveTrafficScores[i] : baseScore(i);
    if (typeof render === 'function') render();
    document.documentElement.dataset.liveTraffic = 'ready'; document.documentElement.dataset.liveTrafficUpdated = traffic.updatedAt || '';
  };
  fetch('assets/live-vessel-data.json?traffic=' + Date.now(), { cache: 'no-store' }).then((r) => r.ok ? r.json() : null).then((data) => { if (data && data.traffic) apply(data.traffic); }).catch(() => {});
})();
