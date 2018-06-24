var Animator = function (modelo, clips){
    this.modelo = modelo;
    this.animationesClips = clips;
    this.AnimationMixer = new THREE.AnimationMixer(this.modelo);
    
    this.actualizarAnimaciones = function (delta){
        this.AnimationMixer.update(delta);
    }
}
//crear tambien el codigo para un solo objeto, para poder usarlo en el constructor de Personaje
var animatorsFromGLTFLoad = function (gltf){
    //TODO
    //a la espera de https://github.com/KhronosGroup/glTF-Blender-Exporter/pull/166
}

export default Animator;