function colorMapPins(){document.querySelectorAll('.map-pin').forEach(pin=>{const i=Number(pin.dataset.port);pin.classList.remove('green','yellow','orange','red');pin.classList.add(congestionTone(congestionScore(i)))})}
const renderColorBase=render;render=function(){renderColorBase();colorMapPins()};render();
