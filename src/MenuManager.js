var MenuManager = function(){
    this.menuList = {};
    this.activeMenu = undefined;
    
    this.UIButtonAction = function(e){
        var action = e.target.attributes.action.value;
        
        this.activeMenu[action]();
    }.bind(this);
    
    this.changeMenu = function (menu){ //revisar, comprarar con las funciones dissableMenu y ennableMenu
        //intercambiar menus
        menu.node.classList.toggle("dissable"); //deber haber una clase css con este nombre
        this.activeMenu.node.classList.toggle("dissable");
        
        this.activeMenu.active = false;
        this.menu.active = true;
        
        this.activeMenu = menu.name;
    }
    this.dissableMenu = function (){
        if (this.activeMenu === undefined) throw "Puente_Error: No active menu";
        this.activeMenu.node.classList.add("dissable");
        this.activeMenu.active = false;
        this.activeMenu = null;
    }
    this.ennableMenu = function (menu){
        if (this.activeMenu === undefined){
            menu.node.classList.remove("dissable");
            menu.active = false;
            this.activeMenu = menu;
        }else{
            throw "Puente_Error: Another menu is ennabled";
        }
    }
    
    this.addMenu = function (menu){
        this.menuList[menu.name] = menu;
        
        if (menu.active === true){ //ativa el menu
            this.ennableMenu(menu);
        }
    }
}

export default MenuManager;