var FlowManager=function(formData,db,formDataDb){
    this.data=formData;
    this.flow=formData.flow;
    this.lastActiondata=formData.last_action;
    
    for(var m in this.flow){
        var stage=this.flow[m];
        if(this.lastActiondata.uid==stage.uid){
            this.lastAction=stage;
            break;
        }
    }
    
};


FlowManager.prototype.hasNextFlow=function(){
    console.log(this.data);
};

FlowManager.prototype.processFlow=function(){
    
};





module.exports=FlowManager;