var InputSource = function (hardwareName, needUpdate){
    this.needUpdate = needUpdate || false;
    this.hardwareName = hardwareName || "";
    
    this.updateInputSource = function (){};
    this.start = function(){};
    this.stop = function(){};
}

export default InputSource;