(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
var Escenario=require('./escenario');
var escenario=Escenario();
escenario.init(SCREEN_WIDTH,SCREEN_HEIGHT);
escenario.initWebcam(1000,700);
escenario.initMarcador();
escenario.render();
},{"./escenario":3}],2:[function(require,module,exports){
var Vertices=require('./vertices');
module.exports=function(){//var Detector=function(){
	var detector,posicion,objeto,vector_posicion;	
	var detectados=[];
	function init(){
		detector=new AR.Detector();
	   	vertices=Vertices();
	   	vertices.init();
		vector_posicion=new THREE.Vector3();
	}

	function getPosicionReal(escenario,posicion){
			return new THREE.Vector3(posicion.x-(escenario.width/2),
				((-1*posicion.y)+(escenario.height/2)),posicion.z)
	}

	function detectar(escenario,bytes){
		var markers = detector.detect(bytes);   	
		var posiciones=[];
	   	if(markers.length>0){   	
			for(var i=0;i<markers.length;i++){
				posiciones.push(getPosicionReal(escenario,new THREE.Vector3(markers[i].corners[0].x,markers[i].corners[0].y,15)));				
			}
			vertices.anadirPuntos(posiciones);
			escenario.scene.add(vertices.obtenerTrazos());
	   	}
	}

	function obtenerObjeto(){
		return objeto;
	}

	return {
		detectar:detectar,
		obtenerObjeto:obtenerObjeto,
		init:init
	}
}
},{"./vertices":4}],3:[function(require,module,exports){
var Detector=require('./detector');
module.exports=function(){
//var Escenario=function(SCREEN_WIDTH,SCREEN_HEIGHT){
		var camara,scene,renderer,VIEW_ANGLE,ASPECT,SCREEN_WIDTH,SCREEN_HEIGHT,movieScreen,videoTexture,detector;
		var canvas_recipe,canvas_recipe_context,projector,WIDTH_MOVIE,HEIGHT_MOVIE;
		var objetos=[],objetos_en_escena={};			
		var init=function(screen_width,screen_height){
			SCREEN_WIDTH=screen_width;
			SCREEN_HEIGHT=screen_height;
			scene=new THREE.Scene();
			renderer=new THREE.WebGLRenderer();
			renderer.setSize(screen_width,screen_height);
			document.body.appendChild(renderer.domElement);
			definirCamara();
		}
		var definirCamara=function(){			
			var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
			camara = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
			camara.useTarget = false
			camara.position.z=1000;	
			scene.add(camara);
		}		

		var initWebcam=function(WIDTH_INIT,HEIGHT_INIT){
			video= new THREEx.WebcamTexture();
			videoTexture = video.texture;
			WIDTH_MOVIE=WIDTH_INIT;
			HEIGHT_MOVIE=HEIGHT_INIT;
			videoTexture.minFilter = THREE.LinearFilter;
			videoTexture.magFilter = THREE.LinearFilter;
				
			movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );			
			var movieGeometry = new THREE.PlaneGeometry( WIDTH_MOVIE, HEIGHT_MOVIE, 100, 1 );
			movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
			movieScreen.position.set(0,50,0);//*/			
			scene.add(movieScreen);	
			initVideo();
		}

		var getEscenario=function(){
			return {width:video.video.width,height:video.video.height,scene:scene};//{width:WIDTH_MOVIE,height:HEIGHT_MOVIE};
		}

		var initVideo=function(){			
			canvas_recipe=document.createElement("canvas");
			canvas_recipe.width=video.video.width;
			canvas_recipe.height=video.video.height;
			canvas_recipe_context=canvas_recipe.getContext("2d");
		}

		var initMarcador=function(){
			detector=Detector();
			detector.init();
			//scene.add(objeto.obtenerScreen());
		}

		var anadir=function(objeto){
			console.log("anadiendo "+objeto.getNombre());
			objetos.push(objeto.obtenerScreen());
			objetos_en_escena[objeto.obtenerScreen().id]=objeto;
			scene.add(objeto.obtenerScreen());
			//console.log(objetos_textura.length+" llevo tantos objetos");
		}

		var obtenerBytesVideo=function(){
			return canvas_recipe_context.getImageData(0, 0, video.video.width, video.video.height);
		}

		var render=function(){
			rendering();
			dibujarVideo();
			detector.detectar(getEscenario(),obtenerBytesVideo());
			requestAnimationFrame(render);
		}

		var dibujarVideo=function(){
			canvas_recipe_context.drawImage(video.video,0,0,video.video.width,video.video.height)
		}

		var verObjetos=function(){
			for(var i=0;i<objetos.length;i++){
				console.log("los objetos son "+objetos[i].id+" "+objetos[i].position.x+" "+objetos[i].position.y);
			}
		}

		var rendering=function(){
			videoTexture.needsUpdate=true;
			for(var i=0;i<objetos.length;i++)
				objetos[i].needsUpdate=true;		
			renderer.render( scene, camara );
		}

		return{
			anadir:anadir,
			render:render,
			definirCamara:definirCamara,
			initWebcam:initWebcam,
			initMarcador:initMarcador,
			getEscenario:getEscenario,
			verObjetos:verObjetos,
			init:init
		}
}
},{"./detector":2}],4:[function(require,module,exports){
var COLOR_ROJO="#f93e3e";
var COLOR_VERDE="#3be55b";


module.exports=function(){
//var Vertices=function(){
	var geometry,material,linea;
	function init(){
		geometry=new THREE.Geometry();
		material = new THREE.LineBasicMaterial({
				color: COLOR_ROJO
		});
		geometry.dynamic=true;
	}

	function limpiar(){
		geometry=new THREE.Geometry();
	}

	function anadirPunto(posicion){
		geometry.vertices.push(posicion);
	}

	function anadirPuntos(puntos){
		geometry.vertices=puntos;
		geometry.verticesNeedUpdate=true;
	}

	function obtenerTrazos(){
		if(linea==undefined)
			linea=new THREE.Line(geometry,material);		
		geometry.verticesNeedUpdate=true;
		return linea;
	}

	return{
		limpiar:limpiar,
		anadirPunto:anadirPunto,
		anadirPuntos:anadirPuntos,
		obtenerTrazos:obtenerTrazos,
		init:init
	}
}
},{}]},{},[1]);
