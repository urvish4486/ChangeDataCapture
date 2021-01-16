({
    
    /*
     * This method will call the server side action to get user name
     * Once user name retrieved, it will show a warning toast to the user
     * */
    getUser : function(component, userId, eventType, entityName) {
        var action = component.get("c.getUserName");
        action.setParams({
            "userId" : userId
        });
        
        
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") { 
                // pass returned value to callback function
                var userName = response.getReturnValue(); 
                this.showToast({
                    "title":`Record ${eventType}ED`,
                    "type": "warning",
                    "message": `This record has been ${eventType}D by ${userName}`
                });
                
                //Auto refresh the page to get latest details if auto refresh is selected
                if(component.get("v.autoRefresh") === "Yes"){
                    this.autoRefresh();
                }
                 
            } else if (state === "ERROR") {
                // generic error handler
                var errors = response.getError();
                if (errors) {
                    console.error("Error is getting username: ", errors);
                }
                return null;
            }
        });
        
        $A.enqueueAction(action);
    },
    
    /**
     * Get change event object name from 
     * current page's object
     * */
    getChannelName : function(objectName) {
        var isSupported = false;
        //If it is custom object, then it is supported
        if(objectName.includes("__c")){//Custom Object
            objectName = objectName.slice(0, -3); //removing __c from the end
            objectName += "__ChangeEvent"; //appending __ChangeEvent in the end of custom object
            isSupported = true;
        } 
        //check if it is one of the supported standard object from static resource
        else {//Standard Object
            //iterate over supported object list
            window.supportedObjectForChangeEvents.forEach(obj => {
                if(obj.toLowerCase().indexOf(objectName.toLowerCase()) != -1){ 
                //Match found, Object is supported
                objectName += "ChangeEvent" //appending ChangeEvent in the end of standard object
                isSupported = true;
            } 
            });
            
        }
        if(isSupported === true){//is object supported, return channel name
            return `/data/${objectName}`;
        } else{//if object not supported, return null
            return null;
        }
        
    },
    
    /*
     * This function displays toast based on the parameter values passed to it
     * */
    showToast : function(params) {
        var toastEvent = $A.get("e.force:showToast");
        if(toastEvent){
            toastEvent.setParams(params);
            toastEvent.fire();
        } else{
            alert(params.message);
        }
    },
    
    /**
     * Auto refresh the page to get latets details
     * */
    autoRefresh : function(){
        var refreshEvent = $A.get('e.force:refreshView');
        if(refreshEvent){
            refreshEvent.fire();
        } else{
            console.error("Auto refresh is not supported in current context");
        }
    }
})