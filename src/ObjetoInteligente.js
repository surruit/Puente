//Constructores:
//new ObjetoInteligente()
//new ObjetoInteligente(modelo)
//new ObjetoInteligente(modelo, scripts)
var ObjetoInteligente = function (var modelo, scripts){
    this.modelo = modelo;
    this.scripts = scripts || [];
    
    this.exeScripts = function (var delta){
        for (script of this.scripts){
            script();
        }
    }
}