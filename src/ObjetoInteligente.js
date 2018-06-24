//Constructores:
//new ObjetoInteligente()
//new ObjetoInteligente(modelo)
//new ObjetoInteligente(modelo, scripts)
var ObjetoInteligente = function (modelo, scripts){
    this.modelo = modelo;
    this.scripts = scripts || [];
    
    this.exeScripts = function (delta){
        for (var script of this.scripts){
            script(delta);
        }
    }
}

export default ObjetoInteligente;