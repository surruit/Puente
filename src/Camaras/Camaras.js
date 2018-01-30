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
		procesarRaton: (function () { //recibe los eventos del raton //esta funcion contiene errores de migrado
			var mouseMov = {x: 0, y: 0};
			mouseMov.set0 = function (){
				this.x = 0;
				this.y = 0;
			}
			mouseMov.downScale = function (){
				this.x = this.x/1500;
				this.y = this.y/1500;
			}
			
			return function (e){ //closure
				mouseMov.y += e.movementY;
				mouseMov.x += e.movementX;
				
				if (this.timeStamp <= performance.now()){
					this.timeStamp = performance.now() + 8,333; // 1000/120 -> 120 veces por segundo
				}else{
					return;
				}

				if (this.capturandoPuntero){
					console.log(mouseMov);
					//this.eulerCamara.x += -mouseMov.y;
					//this.eulerPersonaje.y += -mouseMov.x;

					//if (this.eulerCamara.x > this.halfPI) this.eulerCamara.x = this.halfPI;
					//if (this.eulerCamara.x < -this.halfPI) this.eulerCamara.x = -this.halfPI;

					

					//this.camaraEmpty.quaternion.setFromEuler(this.eulerCamara);
					//this.parent.quaternion.setFromEuler(this.eulerPersonaje);
					
					mouseMov.downScale();
					this.camaraEmpty.rotateX(-mouseMov.y); //los ejes del raton son distintos
					this.parent.rotateY(-mouseMov.x);
					mouseMov.set0();
					
				}else{
					mouseMov.set0(); //puede parecer una tonteria, pero es una pequeña optimizacion a esta funcion que se llama 1000 veces por segundo, ahorrarle una comprobacion cuando mas potencia necesita ayuda.
				}
			};
		})(),
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
				this.parent.translateZ( -delta*this.velMov);
				//this.moverAdelante(-delta*this.velMov);
			}
			if (this.moviendoA.atras){
				this.parent.translateZ( delta*this.velMov);
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
		this.camaraEmpty = new THREE.Object3D();
		
		//esto sobra, borrarlo
		this.eulerPersonaje = new THREE.Euler( 0, 0, 0, 'YXZ' );
		this.eulerCamara = new THREE.Euler( 0, 0, 0, 'YXZ' );
		

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
		
		this.timeStamp = performance.now();
		

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
		
		//este codigo es temporal, no deberia estar aqui
		
		this.camaraEmpty.add(this.camara);
		objeto.add(this.camaraEmpty);
		this.camara.translateZ(5);
		//this.camaraEmpty.position.copy(camara.position);
		
	};
	CamaraFPS.prototype = Object.assign(CamaraFPS.prototype, gestorEventos, funcionesMov);
	CamaraFPS.prototype.constructor = CamaraFPS;
	
	


	Camaras = {};
	Camaras.CamaraFPS = CamaraFPS;
	
	return Camaras;
})();