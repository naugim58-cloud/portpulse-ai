(function(){
  const update=()=>{
    if(typeof ports==='undefined')return;
    document.querySelectorAll('.map-main-head .badge').forEach(badge=>{
      if(/PORTS\s*[·-]\s*LIVE/i.test(badge.textContent||''))badge.textContent=`${ports.length} PORTS · LIVE`;
    });
  };
  update();
  setInterval(update,300);
})();
