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