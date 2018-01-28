Puente.DB = {
	Luces: {},
	Objetos3D: {},
	PTag: {}
};


Puente.DB.Objetos3D = (function (){
	
	//Clase constructor para las listas de objetos
	var baseObjetoLista = function (tipo){ //recibe el tipo de lista, no de objeto
		this.objetos = [];
		
		this.add = funcionesListas.add;
		this.enableShadowCast = funcionesListas.enableShadowCast;
		this.enableShadowReceive = funcionesListas.enableShadowReceive;
		this.addToScene = funcionesListas.addToScene;
	};
	
	//objeto con todas las funciones usadas por las luces
	var funcionesListas = {
		add: function(objeto){
			this.objetos[this.objetos.length] = objeto;
		},
		enableShadowCast: function (enable){
			for (ob of this.objetos){
				if (enable){
					ob.castShadow = true;
				}else{
					ob.castShadow = false;
				}
			}
		},
		enableShadowReceive: function (enable){
			for (ob of this.objetos){
				if (enable){
					ob.receiveShadow = true;
				}else{
					ob.receiveShadow = false;
				}
			}
		},
		getAll: function (){
			return this.objetos;
		},
		addToScene: function (scene){
			for (ob of this.objetos){
				scene.add(ob);
			}
		}

	};
	
	//funciones de Objetos3D (objeto final)
	var funcionesObjetos3D = {
		autoAdd: function (ob){
			this.listaObjetos3D.todos.add(ob);
			//implementar sistema de parametros EXTRA de blender para agrupar segun ellos, adicionalmente podria haber una funcion autoAdd que ademas cree las listas a partir de esos extras automaticamente.
		},
		autoAddFromScene: function(scene){
			if(scene.type == "Scene"){
				for (ob of scene.children){
					this.autoAdd(ob);
				}
			}else{
				console.error("Puente.DB.Objetos3D:", scene, "is not a scene");
			}
		}
	};
	
	//Listas de objetos
	var lista = {}; //un objeto de objetos lista
	lista.todos = new baseObjetoLista();
	
	var Objetos3D = {};
	Objetos3D.listaObjetos3D = lista;
	Objetos3D.autoAdd = funcionesObjetos3D.autoAdd;
	Objetos3D.autoAddFromScene = funcionesObjetos3D.autoAddFromScene;
	
	return Objetos3D; //devuelve una instancia.
})();


Puente.DB.Luces = (function (){
	
	
	//Listas para los distintos tipos de luz, creadas con un constructor comun
	var baseLuzLista = function (tipo){ //recibe el tipo de lista, no de objeto
		this.luces = [];
		
		this.add = funcionesListas.add;
		this.addToScene = funcionesListas.addToScene;
		
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
	var funcionesListas = {
		add: function(objeto){
			this.luces[this.luces.length] = objeto;
		},
		enableShadow: function (enable){
			console.log(this.luces);
			for (luz of this.luces){
				if (enable){
					luz.castShadow = true;
				}else{
					luz.castShadow = false;
				}
			}
		},
		getAll: function (){
			return this.luces;
		},
		addToScene: function (scene){
			for (luz of this.luces){
				scene.add(luz);
			}
		}
	};
	
	//funciones de Luces (objeto final)
	var funcionesLuces = {
		autoAdd: function (luz){
			this.listaLuces.todas.add(luz);
			if (luz.isAmbientLight){
				this.listaLuces.ambiental.add(luz);
			}
			if (luz.isPointLight){
				this.listaLuces.point.add(luz);
			}
			if (luz.isSpotLight){
				this.listaLuces.spot.add(luz);
			}
			
			if (luz.isPointLight || luz.isSpotLight){
				this.listaLuces.useShadow.add(luz);
			}
		},
		autoAddFromArray: function (lista){
			for (luz of lista){
				this.autoAdd(luz);
			}
		}
	};
	
	//funciones Shadow
	var funcionesShadow = {
		setRender: function (ren){
			render = ren;
		},
		enableShadows: function (){
			render.shadowMap.enabled = true;
			Luces.listaLuces.useShadow.enableShadow(true);
			Puente.DB.Objetos3D.listaObjetos3D.todos.enableShadowCast(true);
			Puente.DB.Objetos3D.listaObjetos3D.todos.enableShadowReceive(true);
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
	
	//Listas de objetos
	var lista = {}; //un objeto de objetos lista
	lista.todas = new baseLuzLista();
	lista.spot = new baseLuzLista("SPOT");
	lista.point = new baseLuzLista("POINT");
	lista.ambiental = new baseLuzLista("AMBIENTAL");
	lista.useShadow = new baseLuzLista("SHADOW");
	
	
	//shadowconfig
	var shadowConfig = {}
	shadowConfig.setRender = funcionesShadow.setRender;
	shadowConfig.enableShadows = funcionesShadow.enableShadows;
	shadowConfig.enableShadowAsStatic = funcionesShadow.enableShadowAsStatic;
	shadowConfig.setShadowQualityLow = funcionesShadow.setShadowQualityLow;
	

	//Definicion de Luces
	var Luces = {};
	Luces.listaLuces = lista;
	Luces.autoAdd = funcionesLuces.autoAdd;
	Luces.autoAddFromArray = funcionesLuces.autoAddFromArray;
	Luces.shadowConfig = shadowConfig;
	
	return Luces;
})();