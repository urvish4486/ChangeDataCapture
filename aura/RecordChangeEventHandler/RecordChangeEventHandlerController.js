({
    
    subscribe: function(component, event, helper) {
        
        var empApi = component.find("empApi");
        
        var channel = component.get("v.channelName");
        
        var replayId = -1;
        
        
        var subscribeCallback = function (message) {
            
            var messageEvent = component.getEvent("onRecordChange");
            if(messageEvent!=null) {
                messageEvent.setParam("recordData", message.data);
                messageEvent.fire();                            
            }
            
            console.log("Received [" + message.channel +
                        " : " + message.data.event.replayId + "] payload=" +
                        JSON.stringify(message.data.payload));
        }.bind(this);
    
        
        empApi.onError(function(error){
            console.log("Received error ", error);
        }.bind(this));
        
        
        empApi.subscribe(channel, replayId, subscribeCallback).then(function(value) {
            console.log("Subscribed to channel " + channel);
            component.set("v.subscription", value);
        });
    },
    
    
    unsubscribe : function (component, event, helper) {
        try{
            
            var empApi = component.find("empApi");
            
            var channel = component.get("v.channelName");
            
            
            var unsubscribeCallback = function (message) {
                console.log("Unsubscribed from channel " + channel);
            }.bind(this);
            
            
            var errorHandler = function (message) {
                console.log("Received error ", message);
            }.bind(this);
            
            
            var subscription = {"id": component.get("v.subscription")["id"],
                                "channel": component.get("v.subscription")["channel"]};
            
            
            empApi.onError(function (error) {
                console.log("Received error ", error);
            }.bind(this));
            
            
            empApi.unsubscribe(subscription, unsubscribeCallback);
        }catch(e){}
    },
})
