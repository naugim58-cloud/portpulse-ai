(function(){
  const update=()=>{
    const img=document.querySelector('.image-logo-mark img');
    if(!img)return;
    const logistics=typeof activeMode!=='undefined'&&activeMode==='logistics';
    const src=logistics?'assets/portpulse-ship-logo-white.png':'assets/portpulse-ship-logo-cutout.png';
    if(!img.src.endsWith(src))img.src=src;
  };
  update();
  setInterval(update,300);
})();
