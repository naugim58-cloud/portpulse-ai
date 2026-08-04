function applyModeTheme(){document.body.classList.toggle('tourism-theme',activeMode==='tourism')}
const themeBaseRender=render;render=function(){themeBaseRender();applyModeTheme()};applyModeTheme();
