public class AccountLwcPicklistValues {
  @AuraEnabled(cacheable=true)
  public static List<Account> getaccountdetails() {
    return [SELECT Id, Name, Active__c FROM Account];
  }

  @AuraEnabled(cacheable=true)
  public static List<String> getPicklistValues(
    String objectName,
    String fieldName
  ) {
    List<String> picklistValues = new List<String>();

    // Fetch the field describe information
    Schema.DescribeFieldResult fieldResult = Schema.getGlobalDescribe()
      .get(objectName)
      .getDescribe()
      .fields.getMap()
      .get(fieldName)
      .getDescribe();

    // Fetch picklist entries
    for (Schema.PicklistEntry entry : fieldResult.getPicklistValues()) {
      picklistValues.add(entry.getLabel());
    }

    return picklistValues;
  }

  @AuraEnabled
  public static void InsertDataAccount(String accountId, String selectedValue) {
    Account acc = [SELECT Id FROM Account WHERE Id = :accountId LIMIT 1];
    acc.Active__c = selectedValue;
    update acc;
  }
}
