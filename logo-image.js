const logoMark=document.querySelector('.brand-mark');if(logoMark){logoMark.classList.add('image-logo-mark');logoMark.innerHTML='<img src="assets/portpulse-ship-logo.png" alt="PortPulse 로고">'}
const settingsScript=document.createElement('script');settingsScript.src='settings.js?v=3';document.body.appendChild(settingsScript);
const firebaseConfigScript=document.createElement('script');firebaseConfigScript.src='firebase-config.js?v=2';document.body.appendChild(firebaseConfigScript);firebaseConfigScript.onload=()=>{const firebaseScript=document.createElement('script');firebaseScript.src='firebase-production.js?v=3';document.body.appendChild(firebaseScript)};
const languageRemovalScript=document.createElement('script');languageRemovalScript.src='language-removal.js?v=1';document.body.appendChild(languageRemovalScript);
const portCountScript=document.createElement('script');portCountScript.src='port-count-fix.js?v=1';document.body.appendChild(portCountScript);
const liveEtaScript=document.createElement('script');liveEtaScript.src='live-ops.js?v=2';document.body.appendChild(liveEtaScript);
const liveModeEtaScript=document.createElement('script');liveModeEtaScript.src='live-mode-eta-fix.js?v=1';document.body.appendChild(liveModeEtaScript);
const etaTypeScript=document.createElement('script');etaTypeScript.src='eta-type-filter.js?v=1';document.body.appendChild(etaTypeScript);
const etaTypeStyle=document.createElement('link');etaTypeStyle.rel='stylesheet';etaTypeStyle.href='eta-type-filter.css?v=1';document.head.appendChild(etaTypeStyle);
const logoModeScript=document.createElement('script');logoModeScript.src='logo-mode-fix.js?v=1';document.body.appendChild(logoModeScript);
const logoModeStyle=document.createElement('link');logoModeStyle.rel='stylesheet';logoModeStyle.href='logo-mode-bg.css?v=1';document.head.appendChild(logoModeStyle);
const tourismContrastStyle=document.createElement('link');tourismContrastStyle.rel='stylesheet';tourismContrastStyle.href='tourism-contrast.css?v=1';document.head.appendChild(tourismContrastStyle);
const liveAlertsScript=document.createElement('script');liveAlertsScript.src='live-alerts-fix.js?v=1';document.body.appendChild(liveAlertsScript);
const compareCleanup=document.createElement('script');compareCleanup.src='remove-compare.js?v=1';document.body.appendChild(compareCleanup);
const peakFix=document.createElement('script');peakFix.src='home-peak-fix.js?v=4';document.body.appendChild(peakFix);
const brandFix=document.createElement('script');brandFix.src='brand-fix.js?v=1';document.body.appendChild(brandFix);
const googleAuth=document.createElement('script');googleAuth.src='google-auth.js?v=1';document.body.appendChild(googleAuth);
(()=>{const update=()=>{const now=new Date(),s=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(now);document.querySelectorAll('.live-clock').forEach(e=>{e.textContent='◷ '+formatKoreanNow()});document.querySelector('header>div')?.replaceChildren(document.createTextNode('● LIVE · '+s+' KST'))};update();setInterval(update,1000)})();
(()=>{const update=()=>{const nav=document.querySelector('nav button[data-r="alerts"]'),badge=nav?.querySelector('em');if(!badge)return;let count=0;if(typeof ports!=='undefined'&&typeof isFavorite==='function'){const names=ports.filter(p=>isFavorite(p[0])).map(p=>p[0]);count+=names.length;if(typeof ships!=='undefined')count+=ships.filter(s=>names.includes(s[1])).length}badge.textContent=String(count);badge.hidden=count===0};update();setInterval(update,1000)})();

