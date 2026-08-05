/*
 * Congestion inference layer.
 * The browser never receives an API key.  It reads the sanitized snapshot
 * produced by GitHub Actions and calculates a score from available signals.
 */
(function () {
  const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
  const num = (v) => { const n = Number(String(v ?? '').replace(/[% ,]/g, '')); return Number.isFinite(n) ? n : null; };
  const portAliases = {
    '부산신항': ['부산신항', '신항'],
    '북항': ['북항', '부산항'],
    '감천항': ['감천항'],
    '다대포항': ['다대포항'],
    '남항': ['남항']
  };
  const findPort = (name) => {
    const value = String(name || '');
    const exact = Object.keys(portAliases).find((port) => portAliases[port].some((alias) => value.includes(alias)));
    // The public operations feed reports “부산” at city level. Keep those
    // observations visible by assigning them to the representative North Port.
    return exact || (value.includes('부산') ? '북항' : '');
  };
  const isInbound = (record) => /입항|입港|inbound|arrival|entry/i.test(String(record.entryType || record.direction || '')) || /부산|busan/i.test(String(record.destinationPort || record.nextPort || ''));
  const weatherPressure = (weather) => {
    if (!weather || weather.error) return 0;
    const wind = num(weather.windSpeedKn) || 0;
    const wave = num(weather.waveHeightM) || 0;
    return clamp((wind / 20) * 60 + (wave / 2.5) * 40);
  };
  const applyScores = (scores, meta, snapshot) => {
    if (!scores || typeof congestionScore !== 'function') return;
    const baseScore = congestionScore;
    window.liveTrafficScores = scores;
    window.congestionInputs = meta;
    window.liveTraffic = snapshot;
    window.congestionModel = 'AIS 입출항 + 접안대기 + 물동량 + 기상 기반 추정';
    window.congestionScore = (i) => Object.prototype.hasOwnProperty.call(window.liveTrafficScores, i) ? window.liveTrafficScores[i] : baseScore(i);
    if (typeof render === 'function') render();
    document.querySelectorAll('.detail-note').forEach((el) => { el.textContent = '✦ 누적 AIS·입출항·접안대기·기상 데이터를 바탕으로 혼잡도를 계산합니다.'; });
    document.documentElement.dataset.liveTraffic = 'ready';
    document.documentElement.dataset.liveTrafficUpdated = snapshot.updatedAt || '';
  };
  const applyTrafficApi = (traffic) => {
    const rows = (traffic.records || []).map((r) => ({ density: num(r.density), count: num(r.vesselCount) })).filter((r) => r.density !== null || r.count !== null);
    if (!rows.length) return false;
    const maxCount = Math.max(1, ...rows.map((r) => r.count || 0));
    const scores = {};
    (typeof ports !== 'undefined' ? ports : []).forEach((p, i) => {
      const values = rows.map((r) => r.density !== null ? r.density : ((r.count || 0) / maxCount) * 100);
      const live = values.reduce((a, b) => a + b, 0) / values.length;
      scores[i] = clamp(congestionScore(i) * 0.35 + live * 0.65);
    });
    applyScores(scores, {}, traffic);
    return true;
  };
  const applyVesselSnapshot = (data) => {
    const records = Array.isArray(data.records) ? data.records : [];
    if (!records.length || typeof ports === 'undefined') return false;
    const grouped = Object.fromEntries(Object.keys(portAliases).map((name) => [name, []]));
    records.forEach((record) => { const port = findPort(record.portName || record.destinationPort); if (port) grouped[port].push(record); });
    const counts = Object.fromEntries(Object.keys(grouped).map((name) => [name, grouped[name].length]));
    const inbound = Object.fromEntries(Object.keys(grouped).map((name) => [name, grouped[name].filter(isInbound).length]));
    const maxCount = Math.max(1, ...Object.values(counts));
    const maxInbound = Math.max(1, ...Object.values(inbound));
    const scores = {};
    const meta = {};
    ports.forEach((p, i) => {
      const name = p[0];
      const density = (counts[name] || 0) / maxCount * 100;
      const arrivalPressure = (inbound[name] || 0) / maxInbound * 100;
      const waitingPressure = (p[5] / 180) * 100;
      const weather = weatherPressure(data.weather && data.weather[name]);
      // Deterministic lightweight model: live AIS signals are dominant;
      // waiting, weather and the known port operating baseline fill gaps.
      const score = clamp(density * 0.40 + arrivalPressure * 0.20 + waitingPressure * 0.20 + weather * 0.10 + congestionScore(i) * 0.10);
      scores[i] = score;
      meta[name] = { vesselCount: counts[name] || 0, inboundCount: inbound[name] || 0, densityScore: clamp(density), arrivalPressure: clamp(arrivalPressure), waitingPressure: clamp(waitingPressure), weatherPressure: weather };
      // Use observed AIS count in cards instead of the old demo count.
      if (counts[name]) p[4] = counts[name];
    });
    applyScores(scores, meta, { source: 'AIS 선박운항 누적 스냅샷 기반 혼잡도 추정', updatedAt: data.updatedAt, records });
    return true;
  };
  const refresh = () => fetch('assets/live-vessel-data.json?traffic=' + Date.now(), { cache: 'no-store' })
    .then((r) => r.ok ? r.json() : null)
    .then((data) => {
      if (!data) return;
      // Prefer the dedicated traffic API when it has rows; otherwise infer
      // congestion from the accumulated AIS operations snapshot.
      if (!applyTrafficApi(data.traffic || {})) applyVesselSnapshot(data);
    })
    .catch(() => {});
  refresh();
  // Recalculate from the latest sanitized snapshot every 30 minutes.
  setInterval(refresh, 30 * 60 * 1000);
})();
