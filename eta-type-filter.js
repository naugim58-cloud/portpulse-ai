(function(){
  let selectedType='all';
  const isCruise=el=>/크루즈|cruise|여객|터미널|ferry|cruise/i.test(el?.textContent||'');
  const update=()=>{
    if(typeof route==='undefined'||route!=='eta')return;
    const search=document.getElementById('search');
    if(!search)return;
    let bar=document.querySelector('.eta-type-filter');
    if(!bar){bar=document.createElement('div');bar.className='eta-type-filter';bar.innerHTML='<button data-type="all" class="active">전체</button><button data-type="logistics">물류선박</button><button data-type="cruise">크루즈·여객선</button>';search.parentElement.insertBefore(bar,search);bar.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{selectedType=btn.dataset.type;bar.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===btn));apply()})}
    apply();
  };
  const apply=()=>{document.querySelectorAll('.ship').forEach(card=>{const cruise=isCruise(card),show=selectedType==='all'||(selectedType==='cruise'?cruise:!cruise);card.style.display=show?'flex':'none'})};
  new MutationObserver(update).observe(document.getElementById('page')||document.body,{childList:true,subtree:true});
  setInterval(update,500);
})();
