trigger OpptyChangeTrigger on OpportunityChangeEvent (after insert) {

    List<Task> lsttask = new List<Task>();
    for(OpportunityChangeEvent objOpp : trigger.new)
    {
        Eventbus.ChangeEventHeader header = objOpp.ChangeEventHeader;
        System.debug('Received change event for :' + header.entityName + ' : for the ::' +
  						header.changeType + ': operation.:' + objOpp.StageName);
        if (header.changetype == 'UPDATE') 
        { 
        	if (objOpp.StageName=='Closed Won') 
            { 
        		System.debug('should create task now');
        		Task tk = new Task();
        		tk.Subject = 'Follow up on won opportunities: ' + header.recordIds;
        		tk.OwnerId = header.CommitUser;
        		lsttask.add(tk);
        	}
        }
    }
    if (lsttask.size() > 0) 
    {
        insert lsttask;
    }
}