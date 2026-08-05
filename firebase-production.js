/* Production Firebase Auth bridge. Put the public Firebase web config in
   firebase-config.js (never put an Admin SDK key in this repository). */
(function(){
  const config=window.PORTPULSE_FIREBASE_CONFIG;
  if(!config||!config.apiKey){window.portpulseFirebaseReady=false;return}
  const load=(src)=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});
  Promise.all([load('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js'),load('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js')]).then(()=>{
    if(!firebase.apps.length)firebase.initializeApp(config);window.portpulseFirebaseAuth=firebase.auth();window.portpulseFirebaseReady=true;
    document.addEventListener('click',async(e)=>{const b=e.target.closest('#settings-auth [data-action]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();const f=document.getElementById('settings-auth'),email=String(new FormData(f).get('email')||'').trim(),password=String(new FormData(f).get('password')||'');if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return alert('아이디는 이메일 형식으로 입력해주세요. 예: name@example.com');if(password.length<6)return alert('비밀번호는 6자 이상 입력해주세요.');try{const cred=b.dataset.action==='signup'?await portpulseFirebaseAuth.createUserWithEmailAndPassword(email,password):await portpulseFirebaseAuth.signInWithEmailAndPassword(email,password);localStorage.setItem('portpulse-session',cred.user.email);if(typeof openSettings==='function')openSettings();if(typeof render==='function')render()}catch(err){alert(err.code==='auth/email-already-in-use'?'이미 등록된 이메일입니다.':err.code==='auth/invalid-credential'?'이메일 또는 비밀번호를 확인하세요.':err.message)}} ,true);
    portpulseFirebaseAuth.onAuthStateChanged(user=>{if(user){localStorage.setItem('portpulse-session',user.email);if(typeof window.syncAccountFavorites==='function')window.syncAccountFavorites(user.email);if(typeof window.render==='function')window.render()}else{localStorage.removeItem('portpulse-session');}});
  }).catch(()=>{window.portpulseFirebaseReady=false});
})();
