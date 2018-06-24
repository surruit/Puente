var InputMenu = function (){
    var updateInput = function (){
        //TODO
    }
    
    var buttonOverSound_path = undefined; // ejemplo: "Media/UI/click4.wav"
    var buttonOverSound = function(){
        //TODO: intentar opcimizar con un closure
        var audio = new Audio(buttonOverSound_path);
        audio.volume = 0.5;
        audio.play();
    }
    
    var buttonClickDownSound_path = undefined; // ejemplo: Media/UI/mouseclick1.wav"
    var buttonClickDownSound = function(){
        //TODO: intentar opcimizar con un closure
        var audio = new Audio(buttonClickDownSound_path);
        audio.volume = 0.5;
        audio.play();
    }
    
    var buttonClickUpSound_path = undefined; // ejemplo: "Media/UI/mouserelease1.wav"
    var buttonClickUpSound = function(){
        //TODO: intentar opcimizar con un closure
        var audio = new Audio(buttonClickUpSound_path);
        audio.volume = 0.5;
        audio.play();
    }
    
    
    this.registerButton = function (boton){
        boton.addEventListener("mouseover", buttonOverSound);
        boton.addEventListener("mousedown", buttonClickDownSound);
        boton.addEventListener("mouseup", buttonClickUpSound);
    }
    
    this.removeButton = function (boton){
        boton.removeEventListener("mouseover", buttonOverSound);
        boton.removeEventListener("mousedown", buttonClickDownSound);
        boton.removeEventListener("mouseup", buttonClickUpSound);
    }
    
    this.registerAllWithCSSClass = function (CSSClass){
        var lista = document.getElementsByClassName(CSSClass);
        
        for (var boton of lista){
            this.registerButton(boton);
        }
    }
    this.removeAllWithCSSClass = function (CSSClass){
        var lista = document.getElementsByClassName(CSSClass);
        
        for (var boton of lista){
            this.removeButton(boton);
        }
    }
}