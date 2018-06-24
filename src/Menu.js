//name debe ser tambien el id del elemento o debe ser actualizado a mano despues de su creacion

var Menu = function(name, menuManager){
    this.name = name;
    this.node = document.getElementById(name);
    this.actions = {};
    this.menuManager = menuManager;
    this.active = false;
    
    this.addAction = function (actionName, actionFunction){
        this.actions[actionName] = actionFunction;
    }
    
    //ejecuta los actions usando el id
    this.ActionEventListener = function (e){
        this.actions[e.target.id]();
    }.bind(this);
}

export default Menu;