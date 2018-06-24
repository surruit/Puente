import "./InputSource.js";
import "./KeyMap2.js";

var InputSourceKeyBoard = function(){
    Puente.InputSource.call(this);
    
    //configuraciones
    this.hardwareName = "Teclado";
    
    //añadir o quitar al keyMap sus mapeos
    var keyMap = new Puente.KeyMap();
    var keyMapAdd = function (){
        keyMap.map("up", "W");
        keyMap.map("up", "w");
        keyMap.map("down", "S");
        keyMap.map("down", "s");
        keyMap.map("l", "A");
        keyMap.map("l", "a");
        keyMap.map("r", "D");
        keyMap.map("r", "d");
        keyMap.map("salto", " ");
    }
    var keyMapRemove = function (){
        //TODO
    }
    
    //receptores de eventos
    var keyDownEvent = function (e){
		keyMap.updateByHKey(e.key, 1.0);
	};
	var keyUpEvent = function (e){
		keyMap.updateByHKey(e.key, 0.0);
	};
    
    //inicializador de eventos
    var startListeners = function(){
		document.addEventListener("keydown", keyDownEvent);
		document.addEventListener("keyup", keyUpEvent);
	};
    
    var removeListeners = function(){
        document.removeEventListener("keydown", keyDownEvent); 
        document.removeEventListener("keyup", keyUpEvent); 
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
    
    this.updateTo = function(inputSystem){
        for (var key of Object.keys(inputSystem.vKeysState)){
            if (keyMap.vKeyState[key] !== undefined){
                inputSystem.vKeysState[key] = keyMap.vKeyState[key];
            }
        }
    }
}

export default InputSourceKeyBoard;