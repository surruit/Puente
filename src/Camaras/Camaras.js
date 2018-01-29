Puente.Camaras = (function(){
	var Camaras; //contiene la parte de acceso publico
	

	//Las siguientes funciones controlan eventos o son llamadas por eventos
	var gestorEventos = {
		pedirPuntero: function(){
			if (document.pointerLockElement !== this.canvas){ //si el elemento que esta capturando el puntero no es nuestro canvas, solicita capturar el puntero
				this.canvas.requestPointerLock();
			}
		},
		startListeners: function(){
			document.addEventListener("pointerlockchange", funcionesEventos.pointerLockChange.bind(this)); //####estaba editando esto
			document.addEventListener("mousemove", funcionesEventos.procesarRaton.bind(this));
			document.addEventListener("keydown", funcionesEventos.keyDownEvent.bind(this));
			document.addEventListener("keyup", funcionesEventos.keyUpEvent.bind(this));
		}
	};
	
	var funcionesEventos = {
		pointerLockChange:  function (e) {
			if (document.pointerLockElement === this.canvas){
				//se ha bloqueado el puntero
				this.capturandoPuntero = true;
			}else{
				//El puntero ya no esta bloqueado
				this.capturandoPuntero = false;
			}
		},
		procesarRaton: function (e) { //recibe los eventos del raton //esta funcion contiene errores de migrado
			if (this.capturandoPuntero){
				this.mouseMov.y += e.movementY;
				this.mouseMov.x += e.movementX;
				
				this.eulerCamara.x += -this.mouseMov.y/this.velRotacion;
				this.eulerPersonaje.y += -this.mouseMov.x/this.velRotacion;
				
				if (this.eulerCamara.x > this.halfPI) this.eulerCamara.x = this.halfPI;
				if (this.eulerCamara.x < -this.halfPI) this.eulerCamara.x = -this.halfPI;

				this.mouseMov = {x: 0, y: 0}; // esto hace que gaste mucha memoria reservando memoria extra en cada movimiento del raton, crear un gestor con una funcion set0()
				
				this.camaraEmpty.quaternion.setFromEuler(this.eulerCamara);
			}
		},
		keyDownEvent: function (e) {
			let key = this.keyMap[e.key];
			switch (key){
				case "avanzar":
					this.moviendoA.avanzar = true; break;
				case "retroceder":
					this.moviendoA.atras = true; break;
				case "derecha":
					this.moviendoA.derecha = true; break;
				case "izquierda":
					this.moviendoA.izquierda = true; break;
			}
		},
		keyUpEvent: function (e) {
			let key = this.keyMap[e.key];
			switch (key){
				case "avanzar":
					this.moviendoA.avanzar = false; break;
				case "retroceder":
					this.moviendoA.atras = false; break;
				case "derecha":
					this.moviendoA.derecha = false; break;
				case "izquierda":
					this.moviendoA.izquierda = false; break;
			}
		}
	};
	
	var funcionesMov = {
		updateMov: function (delta) {
			if (this.moviendoA.avanzar){
				this.moverAdelante(-delta*this.velMov);
			}
			if (this.moviendoA.atras){
				this.moverAdelante(delta*this.velMov);
			}
			if (this.moviendoA.izquierda){
				console.log("parent:", this.parent);
				this.parent.translateX( -delta*this.velMov);
			}
			if (this.moviendoA.derecha){
				this.parent.translateX(delta*this.velMov);
			}
		},
		moverAdelante: function (movimiento) {
			var v = new THREE.Vector3(0, 0, 1); //vector de movimiento hacia delante
			var q = new THREE.Quaternion();
			var e = new THREE.Euler( 0, 0, 0, 'YXZ' );
			e.copy(this.eulerPersonaje);
			e.x = 0;
			q.setFromEuler(e);
			v.applyQuaternion(q);
			this.parent.position.add(v.multiplyScalar(movimiento));	
		}
	};
	
	var funcionesAni = {
		
	};
	
	//constructor para las camaras
	var PuenteCamara = function(canvas, camara){
		this.camara; //camara Threejs
		this.camaraEmpty;

		this.parent; //objeto al que se fija la camara, todos sus movimientos afectan a la camara y la camara puede afectar al objeto (por ejemplo, rotandolo o moviendolo). En un FPS, parent seria el personaje que controla el jugador.

		this.canvas; //elemento canvas para bloquear el puntero
		this.capturandoPuntero; //booleano para controlar si se aplican los movimientos del raton o no.
		this.keyMap = {
			"W": "avanzar",
			"w": "avanzar",
			"S": "retroceder",
			"s": "retroceder",
			"A": "izquierda",
			"a": "izquierda",
			"D": "derecha",
			"d": "derecha"
		};

		this.moviendoA = {
			avanzar: false,
			retroceder: false,
			izquierda: false,
			derecha: false
		};

		this.velMov = 2; //velocidad de movimiento (por segundo)
		this.velRot = 1000;
		

		if (camara != undefined){
			this.camara = camara;
		}else{
			this.camara = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		}
		
		this.canvas = canvas;
		canvas.addEventListener("click", this.pedirPuntero.bind(this));
		
		
	};
	
	//Creacion de la camara CamaraFPS
	var CamaraFPS = function(canvas, camara, personaje){
		PuenteCamara.call(this, canvas); //llamada al constructor padre.
		
		this.isCamaraFPS = true;
		this.parent = personaje;
	};
	CamaraFPS.prototype = Object.create(PuenteCamara.prototype);
	CamaraFPS.prototype.setParent = function (objeto){
		this.parent = objeto;
	};
	CamaraFPS.prototype = Object.assign(CamaraFPS.prototype, gestorEventos, funcionesMov);
	CamaraFPS.prototype.constructor = CamaraFPS;
	
	


	Camaras = {};
	Camaras.CamaraFPS = CamaraFPS;
	
	return Camaras;
})();