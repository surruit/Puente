var Lista = {};

Lista.Moviles = function (){
    this.moviles = [];
    
    this.addMovil = function(movil){
        this.moviles.push(movil);
    }
    
    this.updateMov(delta){
        for (movil of this.moviles){
            movil.actualizarMovimiento(delta);
        }
    }
}

export default Lista;