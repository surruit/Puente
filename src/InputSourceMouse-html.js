import "./InputSource.js";
import "./KeyMap2.js";

var InputSourceKeyBoard = function(){
    InputSource.call(this);
    
    //configuraciones
    this.hardwareName = "Raton";
    
    //variables especificas
    var capturandoPuntero = false;
    var html = document.getElementsByTagName("html")[0];
    
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
    
    //añadir o quitar al keyMap sus mapeos
    var keyMap = new KeyMap();
    var keyMapAdd = function (){
        keyMap.map("primary", "1");
        keyMap.map("secondary", "2");
        keyMap.map("h_rot", "h_rot");
        keyMap.map("v_rot", "v_rot");
    }
    var keyMapRemove = function (){
        //TODO
    }
    
    //receptores de eventos
    var pointerLockChange = function (e) {
        if (document.pointerLockElement === html){
            //se ha bloqueado el puntero
            capturandoPuntero = true;
        }else{
            //El puntero ya no esta bloqueado
            capturandoPuntero = false;
        }
    };
    var procesarRaton = function (e){
        if (capturandoPuntero){
            mouseMov.y += e.movementY;
            mouseMov.x += e.movementX;
        }
    };
    var mouseUp = function (e){
        if (capturandoPuntero){
            e.preventDefault();
            e.stopPropagation();
            keyMap.updateByHKey(e.button, 1.0);
        }
    }
    var mouseDown = function (e){
        if (capturandoPuntero){
            e.preventDefault();
            e.stopPropagation();
            keyMap.updateByHKey(e.button, 0.0);
        }
    }
    var pedirPuntero = function(){
        if (document.pointerLockElement !== html){ //si el elemento que esta capturando el puntero no es nuestro canvas, solicita capturar el puntero
            html.requestPointerLock();
        }
    }
        
    
    //inicializador de eventos
    var startListeners = function(){
        
        
        document.addEventListener("pointerlockchange", pointerLockChange);
		document.addEventListener("mousemove", procesarRaton);
		document.addEventListener("mousedown", mouseDown);
		document.addEventListener("mouseup", mouseUp);
		document.addEventListener("contextmenu", (e) => {e.preventDefault()});
        html.addEventListener("click", pedirPuntero);
	};
    
    var removeListeners = function(){
        //TODO
    }
    
    //funciones publicas
    this.start = function(){
        keyMapAdd();
        startListeners();
    }
    this.stop = function(){
        keyMapRemove();
        removeListeners();
    }
}

export default InputSourceKeyBoard;