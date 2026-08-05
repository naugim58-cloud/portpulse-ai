(function(){
  let selectedType='all';
  const isCruise=el=>/크루즈|cruise|여객|터미널|ferry|cruise/i.test(el?.textContent||'');
  const update=()=>{
    if(typeof route==='undefined'||route!=='eta')return;
    const search=document.getElementById('search');
    if(!search)return;
    let bar=document.querySelector('.eta-type-filter');
    if(!bar){bar=document.createElement('div');bar.className='eta-type-filter';search.parentElement.insertBefore(bar,search)}
    const tourism=typeof activeMode!=='undefined'&&activeMode==='tourism';
    const desired=tourism?'<button data-type="cruise" class="active">크루즈·여객선</button>':'<button data-type="logistics" class="active">물류선박</button>';
    if(bar.innerHTML!==desired){selectedType=tourism?'cruise':'logistics';bar.innerHTML=desired;bar.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{selectedType=btn.dataset.type;apply()})}
    apply();
  };
  const apply=()=>{document.querySelectorAll('.ship').forEach(card=>{const cruise=isCruise(card),show=selectedType==='all'||(selectedType==='cruise'?cruise:!cruise);card.style.display=show?'flex':'none'})};
  new MutationObserver(update).observe(document.getElementById('page')||document.body,{childList:true,subtree:true});
  setInterval(update,500);
})();
