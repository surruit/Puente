Puente.DB = {
	Luces: {}
	Objetos3D: {}
	PTag: {}
	
};

//PTag contiene constantes Tag, se agrega en cada objeto, en un array PTag.
//Mediante los PTag se pueden hacer tareas de grupo, como activar las sombras en todos los Objetos3D con el PTag Sombras

//Los grupos se pueden implementar creando un objeto para cada uno (los objetos se referencian, no se copian, el consumo de memoria es minimo) y estos grupos puede crearlos o destruirlos el usuario.

Puente.DB.Objetos3D = (function (){
	var listaObjetos = []; //un array con todos los objetos
	
	Objetos3D = function(){};
	
	Objetos3D.prototype = {
		constructor: Objetos3D,
		
		add: function(objeto){
			listaObjetos[listaObjetos.length] = objeto;
		}
	};
	
	return new Objetos3D; //devuelve una instancia.
})();
					   
Puente.DB.Luces = (function (){
	
	//Listas de objetos
	var lista = {}; //un objeto de objetos lista
	lista.todas = {}; //un objeto con todas las luces
	
	lista.spot = {}; //un objeto con todas las luces de tipo spot
	lista.point = {}; //un objeto con todas las luces de tipo point
	lista.ambiental = {}; //un objeto con todas las luces de tipo ambiental
	
	lista.useShadow = {}; //un objeto con todas las luces que usan, usaran o han usado sombras (que contiene exactamente lo decide el que lo usa)
	
	//shadowconfig
	var shadowConfig = {}
	shadowConfig.setRender = funcionesShadow.setRender;
	shadowConfig.enableShadows = funcionesShadow.enableShadows;
	shadowConfig.enableShadowAsStatic = funcionesShadow.enableShadowAsStatic;
	

	//Definicion de Luces
	var Luces = {};
	Luces.luces = lista;
	Luces.autoAdd = funcionesLuces.autoAdd;
	Luces.shadowConfig = shadowConfig;
	
	//definicion de listas especificas
	lista.todas = new baseLuzLista();
	lista.spot = new baseLuzLista("SPOT");
	lista.point = new baseLuzLista("POINT");
	lista.ambiental = new baseLuzLista("AMBIENTAL");
	lista.useShadow = new baseLuzLista("SHADOW");
	
	
	//Listas para los distintos tipos de luz, creadas con un constructor comun
	baseLuzLista = function (tipo){ //recibe el tipo de lista, no de objeto
		this.luces = {};
		
		this.add = funcionesListas.add;
		
		if (tipo == "SPOT"){
			this.enableShadow = funcionesListas.enableShadow;
		}
		
		if (tipo == "POINT"){
			this.enableShadow = funcionesListas.enableShadow;
		}
		
		if (tipo == "AMBIENT"){
			
		}
		
		if (tipo == "SHADOW"){
			this.enableShadow = funcionesListas.enableShadow;
		}
	};
	
	//objeto con todas las funciones usadas por las luces
	funcionesListas = {
		add: function(objeto){
			this.luces[this.luces.length] = objeto;
		},
		enableShadow: function (enable){
			for (luz of this.luces){
				if (enable){
					luz.castShadow = true;
				}
			}
		},
		getAll: function (){
			return this.luces;
		}

	};
	
	//funciones de Luces (objeto final)
	funcionesLuces = {
		autoAdd: function (luz){
			this.luces.todas.add(luz);
			if (luz.isAmbientLight){
				this.luces.ambiental.add(luz);
			}
			if (luz.isPointLight){
				this.luces.point.add(luz);
			}
			if (luz.isSpotLight){
				this.luces.spot.add(luz);
			}
		}
	};
	
	//funciones Shadow
	funcionesShadow = {
		setRender: function (ren){
			render = ren;
		},
		enableShadows: function (){
			render.shadowMap.enabled = true;
			Luces.luces.useShadow.enableShadow(true);
			//llamada a la funcion que tiene los objetos que castean sombras
			//llamada a la funcion que tiene los objetos que reciben sombras
			},
		enableShadowAsStatic: function (){
			funcionesShadow.enableShadows();
			render.shadowMap.autoUpdate = false;
			render.shadowMap.needsUpdate = true;
		},
		setShadowQualityLow: function (){
			render.shadowMap.type = THREE.BasicShadowMap;
		}
	};
	
	return Luces;
})();