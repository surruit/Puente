var Movil = function(modelo, velocidad){
    this.modelo = modelo;
    this.velocidad = velocidad || 0; // m/s
    this.movimientoLocal = new THREE.Vector3(0, 0, 0);
    this.gravedad = 9.8; // m/s, no m/s^2
    this.friccion = 1; // m/s 
    
    this.actualizarMovimiento = (function (){
        var vectorMovimiento = new THREE.Vector3(0, 0, 0);
        
        return function(delta){
            //clona la posicion actual
            vectorMovimiento.copy(this.movimientoLocal);
            
            //clona la rotacion (???)
            //.applyQuaternion( this.modelo.position.quaternion );
            
            //aplica la velocidad a la posicion
            vectorMovimiento.multiplyScalar(this.velocidad);
            
            //aplica la gravedad a la posicion
            vectorMovimiento.setComponent(2, vectorMovimiento.getComponent(2) + this.gravedad);
            
            //aplica el delta (paso del tiempo)
            vectorMovimiento.multiplyScalar(delta);
            
            //aplica la nueva posicion al objeto
            this.modelo.position.add(vectorMovimiento);
        }
    })();
}

export default Movil;