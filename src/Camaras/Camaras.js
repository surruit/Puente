Puente.Controles = {};
Puente.Controles.KeyMap = (function (){
	var KeyMap = function (){
		this.vKey ={};
		this.vKeyState = {};
	};
	KeyMap.prototype.updateByHKey = function (hKey, pulsado){
		this.vKeyState[this.vKey[hKey]] = pulsado;
	};
	KeyMap.prototype.map = function (vKey, hKey){
		this.vKey[hKey] = vKey;
	};
	KeyMap.prototype.isPulsado = function (hKey){
		return this.vKeyState[this.vKey[hKey]];
	};
	KeyMap.prototype.getState = function(vKey){
		return this.vKeyState[vKey];
	};
	KeyMap.prototype.getPulsados = function(){
		return generarArray(this.vKeyState);
	}
	
	generarArray = (function (objeto){
		array = [];
		return function (objeto){
			array.length = 0; //vaciado del array
			for (i in objeto){
				if (objeto[i]) array.push(i);
			}
			return array;
		}
	})();
	
	return KeyMap;
})();
Puente.Controles.KeyMapTemplates = (function (){
	var KeyMapTemplates = {};
	
	KeyMapTemplates.WASD = function(){
		var t = new Puente.Controles.KeyMap();
		t.map("up", "W");
		t.map("up", "w");
		t.map("down", "S");
		t.map("down", "s");
		t.map("l", "A");
		t.map("l", "a");
		t.map("r", "D");
		t.map("r", "d");
		
		return t;
	};
	
	KeyMapTemplates.Mouse = function(){
		var t = new Puente.Controles.KeyMap();
		t.map("L_click", "1");
		t.map("R_click", "2");
		//t.map("L_click", "3");
		//t.map("R_click", "3");
		return t;
	};
	
	return KeyMapTemplates;
})();

Puente.Controles.Input = function (){};
Puente.Controles.Input.prototype = {
	action: function (){},
	update: function (){}
}; //usado solo para comprobar el instanceof (como clase abstracta)

Puente.Controles.InputMouse_Base = (function (){
	var canvas = null; //elemento canvas para bloquear el puntero
	
	//mouseMov, para gestion del movimiento del raton
	var mouseMov = {x: 0, y: 0};
	mouseMov.set0 = function (){
		this.x = 0;
		this.y = 0;
	};
	mouseMov.downScale = function (){
		this.x = this.x/1500;
		this.y = this.y/1500;
	};
	
	//declaracion de funciones del prototipo
	var InputMouse_Base = function(parametros = {canvas: undefined, keyMap: undefined}){
		if (parametros.canvas == undefined) throw "Puente.Controles.InputMouse_Base: 'canvas' no puede ser undefined"
		canvas = parametros.canvas;
		
		this.capturandoPuntero = false; //booleano para controlar si se aplican los movimientos del raton o no.
		this.keyMap = parametros.keyMap || new Puente.Controles.KeyMapTemplates.Mouse(); //= new Puente.Controles.KeyMapTemplates.WASDRaton();
		this.vel = 1; //creo que aun no lo uso
		startListeners.call(this); //es necesario pasarle el contexto
	};
	InputMouse_Base.prototype = {
		constructor: InputMouse_Base,
		pedirPuntero: function(){
			if (document.pointerLockElement !== canvas){ //si el elemento que esta capturando el puntero no es nuestro canvas, solicita capturar el puntero
				canvas.requestPointerLock();
			}
		},
		update: function(delta){
			if (this.capturandoPuntero){
				mouseMov.downScale();

				this.action(this, mouseMov, this.keyMap.getPulsados(), delta); //callback

				mouseMov.set0();
			}else{
				mouseMov.set0();
			}
		},
		action: function (mov, keyMapPulsados, delta){} //callback, se ejecuta en el update
	};

	//declaracion de funciones internas (en closure)
	var startListeners = function (){
		document.addEventListener("pointerlockchange", pointerLockChange.bind(this));
		document.addEventListener("mousemove", procesarRaton.bind(this));
		document.addEventListener("mousedown", mouseDown.bind(this));
		document.addEventListener("mouseup", mouseUp.bind(this));
		document.addEventListener("contextmenu", (e) => {e.preventDefault()});
		canvas.onclick = () => this.pedirPuntero();
	};
	var pointerLockChange = function (e) {
		if (document.pointerLockElement === canvas){
			//se ha bloqueado el puntero
			this.capturandoPuntero = true;
		}else{
			//El puntero ya no esta bloqueado
			this.capturandoPuntero = false;
		}
	};
	var procesarRaton = function (e){
		if (this.capturandoPuntero){
			mouseMov.y += e.movementY;
			mouseMov.x += e.movementX;
		}
		//posible implementacion en un futuro de un sistema que si pasa 1 segundo mas sin llamar a update() reinicie a 0 los valores de mouseMov. Tambien podria ser buena idea hacer esto en el update, ahorrado asi comprobaciones en esta funcion.
	};
	var mouseUp = function (e){
		if (this.capturandoPuntero){
			e.preventDefault();
			e.stopPropagation();
			this.keyMap.updateByHKey(e.button, true);
		}
	}
	var mouseDown = function (e){
		if (this.capturandoPuntero){
			e.preventDefault();
			e.stopPropagation();
			this.keyMap.updateByHKey(e.button, false);
		}
	}
	
	//creacion de la "herencia"
	InputMouse_Base.prototype = Object.assign(Object.create(Puente.Controles.Input.prototype), InputMouse_Base.prototype);
	return InputMouse_Base;
})();

Puente.Controles.InputKeyboard_Base = (function (){
	var InputInputKeyboard_Base = function(parametros = {keyMap: undefined}){
		this.keyMap = parametros.keyMap || new Puente.Controles.KeyMapTemplates.WASD();
		this.vel = 10; //creo que aun no lo uso
		
		startListeners.call(this);
	};
	InputInputKeyboard_Base.prototype = {
		constructor: InputInputKeyboard_Base,
		update: function (delta){
			//console.log(this.keyMap.getPulsados());
			//console.log(delta);
			this.action(this, this.keyMap.getPulsados(), delta);
		},
		action: function (){}
	};
	
	//declaracion de funciones internas
	var startListeners = function(){
		document.addEventListener("keydown", keyDownEvent.bind(this));
		document.addEventListener("keyup", keyUpEvent.bind(this));
	};
	var keyDownEvent = function (e){
		this.keyMap.updateByHKey(e.key, true);
	};
	var keyUpEvent = function (e){
		this.keyMap.updateByHKey(e.key, false);
	};
	
	return InputInputKeyboard_Base;
})();
/*
Puente.Controles.InputMouseFPS = function (){
	var InputMouseFPS = {};
	InputMouseFPS.prototype = Object.assign(Object.create(Puente.Controles.InputMouse_Base.prototype), {
		constructor: function(){
			
		},
		filteredMouseCallback: function (e){ //esto es una funcion de las camaras, no deberia existir.
			this.camaraEmpty.rotateX(-mouseMov.y); //los ejes del raton son distintos
			this.parent.rotateY(-mouseMov.x);
		}
	});
	canvas.addEventListener("click", this.pedirPuntero.bind(this));
};
*/	


Puente.Controles.CamaraBase = function(parametros = {camara: undefined, parent: undefined}){ //se utiliza parametros para las entradas
	this.camara = parametros.camara || new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); //camara Threejs
	this.camaraEmpty = new THREE.Object3D(); //es posible que este objeto mas adelante sea aportado por el loader. Como minimo la posicion de el.
	this.parent = parametros.parent || this.camaraEmpty; //objeto al que se fija la camara, todos sus movimientos afectan a la camara y la camara puede afectar al objeto (por ejemplo, rotandolo o moviendolo). En un FPS, parent seria el personaje que controla el jugador.
	
};
Puente.Controles.CamaraFPS = (function (){
	var CamaraFPS = function (parametros = {camara: undefined, parent: undefined, inputMouse: undefined, inputKeyboard: undefined}){
		Puente.Controles.CamaraBase.call(this, parametros);
		
		//configuracion FPS
		this.camaraEmpty.add(this.camara);
		this.parent.add(this.camaraEmpty);
		this.ajustarAltura(5);
		this.inputMouse = parametros.inputMouse;
		this.inputKeyboard = parametros.inputKeyboard || new Puente.Controles.InputKeyboard_Base();
		this.inputMouse.action = this.mouseAction.bind(this);
		this.inputKeyboard.action = this.keyboardAction.bind(this);
		
		//this.inputMouse
	};
	CamaraFPS.prototype = {
		constructor: CamaraFPS,
		mouseAction: function(input, mouseMov, pulsados){
			this.camaraEmpty.rotateX(-mouseMov.y); //los ejes del raton son distintos
			this.parent.rotateY(-mouseMov.x);
		},
		keyboardAction: function (input, pulsados, delta){
			for (pulsado of pulsados){
				switch(pulsado){
					case "up":
						this.parent.translateZ( -delta*input.vel); break;
					case "down":
						this.parent.translateZ( delta*input.vel); break;
					case "l":
						this.parent.translateX( -delta*input.vel); break;
					case "r":
						this.parent.translateX(delta*input.vel); break;
				}
			}
		},
		update: function (delta){
			this.inputMouse.update(delta);
			this.inputKeyboard.update(delta);
		},
		ajustarAltura: function(x){
			this.camara.translateZ(x);
		}
	};
	
	return CamaraFPS;
})();
/*
Puente.Camaras.Camara = (function(){
	var Camara; //contiene la parte de acceso publico
	

	//Creacion de la camara CamaraFPS
	var Camara = function(canvas, camara, personaje){
		PuenteCamara.call(this, canvas); //llamada al constructor padre.
		
		this.isCamaraFPS = true;
		this.parent = personaje;
	};
	Camara.prototype = Object.create(PuenteCamara.prototype);
	Camara.prototype.setParent = function (objeto){
		this.parent = objeto;
		
		//este codigo es temporal, no deberia estar aqui
		
		this.camaraEmpty.add(this.camara);
		objeto.add(this.camaraEmpty);
		
		//this.camaraEmpty.position.copy(camara.position);
		
	};
	Camara.prototype = Object.assign(CamaraFPS.prototype, gestorEventos, funcionesMov);
	Camara.prototype.constructor = CamaraFPS;
	
	


	Camaras = {};
	Camaras.CamaraFPS = CamaraFPS;
	
	return Camaras;
})();*/