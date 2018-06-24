var PersonajeInput = function (personaje){
    this.target = personaje;
    
    this.updateInput = function (vkeys){
        
        this.target.movimientoLocal.x = (-1*vkeys["l"]) + vkeys["r"];
        this.target.movimientoLocal.z = (-1*vkeys["up"]) + vkeys["down"];
        this.target.movimientoLocal.y = (-1*vkeys["salto"]);
        
        //if(this.target.movimientoLocal.x < 0.25) this.target.movimientoLocal.x = 0;
        //if(this.target.movimientoLocal.z < 0.25) this.target.movimientoLocal.z = 0;
        //if(this.target.movimientoLocal.y < 0.25) this.target.movimientoLocal.y = 0;
    }
}

export default PersonajeInput;