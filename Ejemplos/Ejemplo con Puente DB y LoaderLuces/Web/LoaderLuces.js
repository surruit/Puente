Puente.LoaderLuces = (function() {
	
	LoaderLuces = function (manager){
		this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
	};

	LoaderLuces.prototype = {

		constructor: LoaderLuces,

		load:
			function (url, onLoad, onProgress, onError){
				var scope = this;

				var loader = new THREE.FileLoader( scope.manager );
				
				loader.load( url, function (data){
						var importado = JSON.parse(data);
						var luces = [];

						for (luzJSON in importado){
							var luz = generarLuz(importado[luzJSON]);
							//console.log(luz);
							luces[luces.length] = luz; //luz
						} 
						//luces contiene las luces generadas en formato THREEJS.
						//console.log(luces);
						onLoad(luces);
				},onProgress, function(error){ console.log("aqui error")} );
			}
	};

	generarLuz = function (luzJSON){
		var luz = {};
		var prop = luzJSON.propiedades;
		//console.log(luzJSON.nombre, prop);

		if (luzJSON.tipo == 'SPOT'){
			luz = new THREE.SpotLight(colorArrayToHex(prop.color), prop.energia, prop.distancia, prop.angulo, prop.penumbra);
		}
		
		if (luzJSON.tipo == 'POINT'){
			luz = new THREE.PointLight(colorArrayToHex(prop.color), prop.energia, prop.distancia);
		}
		
		if (luzJSON.tipo == 'AMBIENT'){
			luz = new THREE.AmbientLight(colorArrayToHex(prop.color), prop.energia);
		}
		
		if (luzJSON.tipo == 'POINT' || luzJSON.tipo == 'SPOT'){ //posicion en algunos tipos de luces
			var p = prop.posicion;
			luz.position.set(p[0], p[1], p[2] );
		}
		
		if (luzJSON.tipo == 'SPOT'){ //rotacion de algunos tipos de luces
			var r = prop.rotacion;
			//en Threejs la luz apunta a spot.target, un Object3D.
			//Para cambiar la orientacion de la luz usando la rotacion, podemos añadir el target como hijo y ponerlo justo debajo, siendo asi la rotacion (0, 0, 0) mirar hacia abajo.
			luz.add(luz.target);
			luz.target.position.set(0, -1, 0);
			
			luz.quaternion.fromArray(r);
		}
		return luz;
		
	};
	
	colorArrayToHex = function (color){
		return (color[0]*255 << 16) + (color[1]*255 << 8) + (color[2]*255)
	};
	
	return LoaderLuces;
}) ();