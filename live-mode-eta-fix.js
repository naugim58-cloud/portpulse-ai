(function(){
  if(typeof selectMode!=='function')return;
  const isCruise=v=>/크루즈|cruise|여객|터미널|ferry|passenger|of the seas|spectrum|voyager|oasis|quantum/i.test((v||[]).join(' '));
  const baseSelectMode=selectMode;
  selectMode=function(mode){
    baseSelectMode(mode);
    if(typeof ships!=='undefined'){ships.splice(0,ships.length);if(typeof render==='function')render();}
    window.dispatchEvent(new Event('portpulse:mode'));
    const allowed=mode==='tourism'?['북항','다대포항','영도 크루즈터미널','부산항 관제권']:['부산신항','북항','감천항','남항','부산항 관제권'];
    const source=window.liveEtaShips||[];
    const live=source.filter(v=>allowed.includes(v[1])&&(mode==='tourism'?isCruise(v):!isCruise(v)));
    if(source.length&&typeof ships!=='undefined'){ships.splice(0,ships.length,...(live.length?live:[mode==='tourism'?['크루즈 선박 데이터 없음','관광 모드','공개 API에 크루즈 유형 기록 없음','실시간 확인','-']:['물류 선박 데이터 없음','물류 모드','공개 API에 운항 기록 없음','실시간 확인','-']]));if(typeof render==='function')render();}
  };
})();
