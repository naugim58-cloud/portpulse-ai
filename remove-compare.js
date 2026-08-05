(function(){
  const clean=()=>{document.querySelector('nav button[data-r="compare"]')?.remove();if(typeof route!=='undefined'&&route==='compare'){route='home';if(typeof render==='function')render()}};
  clean();setInterval(clean,500);
})();
