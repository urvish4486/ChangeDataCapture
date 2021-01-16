public class RecordChangeCaptureLightningController {
    
    @AuraEnabled
    public static String getUserName(Id userId){
        User u = [SELECT Name FROM User WHERE Id=:userId];
        return u.Name;
    }

}