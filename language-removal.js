// Language switching is intentionally disabled; keep the settings focused on account personalization.
(function(){
  const removeLanguageSection=()=>{
    const modal=document.getElementById('settings-modal');
    if(!modal)return;
    modal.querySelectorAll('.settings-modal section').forEach(section=>{
      const heading=section.querySelector('h3')?.textContent?.trim();
      if(heading==='언어'||heading==='Language')section.remove();
    });
  };
  removeLanguageSection();
  new MutationObserver(removeLanguageSection).observe(document.body,{childList:true,subtree:true});
})();
