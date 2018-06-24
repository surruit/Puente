var KeyMap = function (){
    
    this.vKey ={};
    this.vKeyState = {};
    
	this.updateByHKey = function (hKey, value){
		this.vKeyState[this.vKey[hKey]] = value;
	};
    
	this.map = function (vKey, hKey){
        this.vKey[hKey] = vKey;
    };
	
    this.getPressed = function(vKey){
        if (this.vKeyState[vKey] > 0.25) return true; //se considera pulsado si la tecla esta al 25% o mas de su valor
        else return false;
	};
    this.getRaw = function(vKey){
		return this.vKeyState[vKey];
	};
}

//var VKeys = {}; //VKeys["primaryAttack"] = 1.0;

export default KeyMap;