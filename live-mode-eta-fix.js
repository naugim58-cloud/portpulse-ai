(function(){
  if(typeof selectMode!=='function')return;
  const baseSelectMode=selectMode;
  selectMode=function(mode){
    baseSelectMode(mode);
    const allowed=mode==='tourism'?['북항','다대포항','영도 크루즈터미널']:['부산신항','북항','감천항','남항'];
    const live=(window.liveEtaShips||[]).filter(v=>allowed.includes(v[1]));
    if(live.length&&typeof ships!=='undefined'){ships.splice(0,ships.length,...live);if(typeof render==='function')render();}
  };
})();
