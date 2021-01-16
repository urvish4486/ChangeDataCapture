({
    checkCompatibility : function(component, event, helper){
        
        var objectName = component.get("v.sObjectName");
        
        if(objectName){
            
            var channelName = helper.getChannelName(objectName);
            
            
            if(channelName){
                component.set("v.channelName", channelName);
                
                component.set("v.isSupported", true);
            } else{
                
                component.set("v.isSupported", false);
            }
            
        } else{
            
            component.set("v.isSupported", false);
        }
    },
    
    handleMessage : function(component, event, helper) {
        const message = event.getParam('recordData');
        const eventType = message.payload.ChangeEventHeader.changeType;
        const entityName = message.payload.ChangeEventHeader.entityName;
        const userId = message.payload.ChangeEventHeader.commitUser.substring(0,15);
        const signedInUser= $A.get("$SObjectType.CurrentUser.Id").substring(0,15); 
        
        
        if(!(eventType === "CREATE")){
            
            Array.from(message.payload.ChangeEventHeader.recordIds).forEach( recordId => {
                if(recordId === component.get("v.recordId") && !(signedInUser === userId)){
                    
                    console.log(`${eventType} event captured on ${entityName} by user id ${userId}`);
                    helper.getUser(component, userId, eventType, entityName);
            	}
             });
        }
    }
})
