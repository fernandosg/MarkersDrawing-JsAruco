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