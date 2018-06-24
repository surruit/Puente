//loadingScreen

//deben definirse y crearse ciertos menus en especifico para usar esto.
//requiere un estilo de css llamado "dissable"

var LoadingScreen = function (elementID, progressBarID){
    this.contenedor = document.getElementById(elementID);
    this.progressBar = document.getElementById(progressBarID);
    
    this.dissable = function(){
        this.contenedor.classList.add("dissable");
    }
    this.ennable = function(){
        this.contenedor.classList.remove("dissable");
    }
    
    this.setLoadingValue = function(value){ //0.0 to 1.0
        this.progressBar.value = value*100;
    }
}

export default LoadingScreen;