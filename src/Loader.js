var GltfExtrasToListas = function(objectList){
    var extras;
    var listasACrear;
    
    var listas = []; //listas finales
    
    for (var objeto of objectList){
        extras = objeto.userData;
        
        if (extras.listas !== undefined){
            listasACrear = JSON.parse(extras.listas);

            for (lista of listasACrear){
                //Comprueba si existe ya la lista, sino la crea
                if (listas[lista] === undefined) listas[lista] = []

                //añadir a la lista
                listas[lista].push(objeto);
            }
        }
    }
    
    return listas;
}

var Loader = function (name, path){
    this.loaded;
    
    this.path = name || "";
    this.name = path || "";
    this.loadingProgress = 0.0; //0.0 = 0% cargado; 1.0 = 100% cargado;
    this.completeCallback = undefined; //no es necesario
    
    //proceso de descarga
    this.gltfLoader = new THREE.GLTFLoader();
    this.onLoadComplete = function (gltf){
        var load = {};
        
        //crea las listas
        load.listas = GltfExtrasToListas(gltf.scene.children);
        
        //un listado de todos los objetos
        load.objects = gltf.scene.children;
        
        if (this.completeCallback !== undefined) this.completeCallback();
        
        this.loaded = load;
    }.bind(this);
    this.onLoadProgress = function (xhr){
        console.log(xhr);
        this.loadingProgress = xhr.loaded / xhr.total;
    }.bind(this);
    this.onLoadError = function (error){
        console.log ("ehh, hamijo que no funca"); //TODO
    }.bind(this);
    this.load = function(){
        console.log(this);
        this.gltfLoader.load(this.path, this.onLoadComplete, this.onLoadProgress, this.onLoadError);
    };
}

export {GltfExtrasToListas, Loader};