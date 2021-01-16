({
    
    getUser : function(component, userId, eventType, entityName) {
        var action = component.get("c.getUserName");
        action.setParams({
            "userId" : userId
        });
        
        
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") { 
                
                var userName = response.getReturnValue(); 
                this.showToast({
                    "title":`Record ${eventType}ED`,
                    "type": "warning",
                    "message": `This record has been ${eventType}D by ${userName}`
                });
                
                
                if(component.get("v.autoRefresh") === "Yes"){
                    this.autoRefresh();
                }
                 
            } else if (state === "ERROR") {
                
                var errors = response.getError();
                if (errors) {
                    console.error("Error is getting username: ", errors);
                }
                return null;
            }
        });
        
        $A.enqueueAction(action);
    },
    
    getChannelName : function(objectName) {
        var isSupported = false;
        
        if(objectName.includes("__c")){
            objectName = objectName.slice(0, -3); 
            objectName += "__ChangeEvent"; 
            isSupported = true;
        } 
        
        else {
            
            window.supportedObjectForChangeEvents.forEach(obj => {
                if(obj.toLowerCase().indexOf(objectName.toLowerCase()) != -1){ 
                
                objectName += "ChangeEvent" 
                isSupported = true;
            } 
            });
            
        }
        if(isSupported === true){
            return `/data/${objectName}`;
        } else{
            return null;
        }
        
    },
    
    showToast : function(params) {
        var toastEvent = $A.get("e.force:showToast");
        if(toastEvent){
            toastEvent.setParams(params);
            toastEvent.fire();
        } else{
            alert(params.message);
        }
    },
    
    autoRefresh : function(){
        var refreshEvent = $A.get('e.force:refreshView');
        if(refreshEvent){
            refreshEvent.fire();
        } else{
            console.error("Auto refresh is not supported in current context");
        }
    }
})
