var LoaderManager = function (){
    this.loaders = [];
    this.loadingInProgress = false;
    this.loadingProgress = 0.0;
    
    this.addLoader = function(loader){
        if (!this.loadingInProgress){
            this.loaders.push(loader);
        }else{
            throw "Error: No se pueden añadir loaders mientras se ejecuta la carga";
        }
    }
    
    this.startLoad = function(){
        for (var loader of this.loaders){
            loader.load();
        }
    }
    
    this.updateLoadProgress = function(){
        this.loadingProgress = 0.0;
        
        for (var loader of this.loaders){
            this.loadingProgress += loader.loadingProgress;
        }
        
        this.loadingProgress /= this.loaders.length;
    }
}

export default LoaderManager;