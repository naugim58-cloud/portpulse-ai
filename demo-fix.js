// 데모 검증용: 감천항 30점은 '보통', 남항은 51~75 구간을 확인할 수 있도록 구성
ports[4][5]=96;
calcInputs[4].volume=8500;
congestionStatus=function(score){return score>=76?'매우 혼잡':score>=51?'혼잡':score>=26?'보통':'원활'};
const demoBaseRender=render;render=function(){demoBaseRender()};render();
