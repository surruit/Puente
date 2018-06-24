var KeyMap = function (){
    
    this.vKey ={};
    this.vKeyState = {};
    
	this.updateByHKey = function (hKey, pulsado){
		this.vKeyState[this.vKey[hKey]] = pulsado;
	};
    
	this.map = function (vKey, hKey){
        this.vKey[hKey] = vKey;
    };
	
    this.isPulsado = function (hKey){
		return this.vKeyState[this.vKey[hKey]];
	};
	
    this.getState = function(vKey){
		return this.vKeyState[vKey];
	};
	
    this.getPulsados = function(){
		return generarArray(this.vKeyState);
	};
	
	this.generarArray = (function (){
        var array = [];
		return function (objeto){
			array.length = 0; //vaciado del array
			for (var i in objeto){
				if (objeto[i]) array.push(i);
			}
			return array;
		}
	})();
}

var KeyMapTemplates = {
    WASD: function(){
        var t = new KeyMap();
		t.map("up", "W");
		t.map("up", "w");
		t.map("down", "S");
		t.map("down", "s");
		t.map("l", "A");
		t.map("l", "a");
		t.map("r", "D");
		t.map("r", "d");
		t.map("salto", " ");
	},
    Mouse: function(){
        var t = new KeyMap();
		t.map("primaryAttack", "1");
		t.map("secondaryAttack", "2");
		//t.map("L_click", "3");
		//t.map("R_click", "3");
	},
    MouseWASD: function(){
        var t = new KeyMap();
		t.map("up", "W");
		t.map("up", "w");
		t.map("down", "S");
		t.map("down", "s");
		t.map("l", "A");
		t.map("l", "a");
		t.map("r", "D");
		t.map("r", "d");
		t.map("salto", " ");
        
        t.map("primaryAttack", "1");
		t.map("secondaryAttack", "2");
    }
}

export {KeyMap, KeyMapTemplates};