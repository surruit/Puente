import "./KeyMap2.js";


var InputSystem = function (keyMap){
    this.inputsToUpdate = [];
    this.vKeysState = {
        "up": 0.0,
        "down": 0.0,
        "l": 0.0,
        "r": 0.0,
        "primary": 0.0,
        "secondary": 0.0,
        "h_rot": 0.0,
        "v_rot": 0.0,
        "salto": 0.0
    }
    this.inputSource = [];
    
    //añadir o elimitar Inputs, destinos de los eventos
    this.addInput = function (input){
        this.inputsToUpdate.push(input);
    }
    this.deleteInput = function (input){
        this.inputsToUpdate.splice(this.inputsToUpdate.indexOf(input));
    }
    
    //añadir o elimitar InputSources, origenes de los eventos
    this.addInputSource = function (inputSource){
        this.inputSource.push(inputSource);
        inputSource.start();
    }
    this.deleteInputSource = function (inputSource){
        this.inputSource.splice(this.inputSource.indexOf(inputSource));
        inputSource.stop();
    }
    
    //llamar a los metodos de actualizacion necesarios
    this.actualizarInputSystem = function (delta){
        for (var inputSource of this.inputSource){
            if (inputSource.needUpdate) inputSource.updateInputSource();
            
            inputSource.updateTo(this);
        }
        
        for (var input of this.inputsToUpdate){
            input.updateInput(this.vKeysState, delta);
        }
    }
}
export default InputSystem;