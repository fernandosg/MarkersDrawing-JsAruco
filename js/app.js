var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
var Escenario=require('./escenario');
var escenario=Escenario();
escenario.init(SCREEN_WIDTH,SCREEN_HEIGHT);
escenario.initWebcam(1000,700);
escenario.initMarcador();
escenario.render();