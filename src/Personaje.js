import ObjetoInteligente from "./ObjetoInteligente.js";
import Movil from "./Movil.js";
import Animator from "./Animator.js";

var Personaje = function(modelo){
    this.modelo = modelo;
    this.vida = 100;
    this.userName = "NoPlayer";
    this.rotacionLocal = new THREE.Vector3(0, 0, 0);
    
    for (var children of this.modelo.children[0].children){
        if (children.name == "camaraContainer"){
            this.camaraContainer = children;
            this.camara = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camaraContainer.add(this.camara);
            break;
        }
    }
    
    
    ObjetoInteligente.call(this, this.modelo);
    Movil.call(this, this.modelo, 20);
    Animator.call(this, this.modelo);
    
    this.actualizarMovimiento = (function (){
        var vector = new THREE.Vector3(0, 0, 0);
        var vectorRot = new THREE.Vector3(0, 0, 0);
        
        return function(delta){
            //fase movimiento
            
            //clona la posicion actual
            vector.copy(this.movimientoLocal);
            
            //clona la rotacion (???)
            //.applyQuaternion( this.modelo.position.quaternion );
            
            //aplica la velocidad a la posicion
            vector.multiplyScalar(this.velocidad);
            
            //aplica la gravedad a la posicion
            vector.setComponent(1, vector.getComponent(1) - this.gravedad);
            
            //aplica el delta (paso del tiempo)
            vector.multiplyScalar(delta);
            
            //aplica la nueva posicion al objeto
            this.modelo.position.add(vector);
            
            //console.log(this.movimientoLocal);
            
            //fase rotacion
            
            //clonar la rotacion modelo
            //this.vectorRot.applyQuaternion(this.modelo.position);
        }
    })();
}


//herencia
//Personaje.prototype = Object.assign(Object.create(Animator.prototype), Personaje.prototype);
//Personaje.prototype = Object.assign(Object.create(ObjetoInteligente.prototype), Personaje.prototype);
//Personaje.prototype = Object.assign(Object.create(Movil.prototype), Personaje.prototype);

//Personaje.prototype.constructor = Personaje;

export default Personaje;