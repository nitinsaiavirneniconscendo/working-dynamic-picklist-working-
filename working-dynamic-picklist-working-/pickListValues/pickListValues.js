import { LightningElement, wire, track } from 'lwc';
import getaccountdetails from '@salesforce/apex/AccountLwcPicklistValues.getaccountdetails';
import getPicklistValues from '@salesforce/apex/AccountLwcPicklistValues.getPicklistValues';
import InsertDataAccount from '@salesforce/apex/AccountLwcPicklistValues.InsertDataAccount';

export default class Picklist extends LightningElement {
    @track accounts;
    @track picklistValues = [];///single picklist value
    @track error;

    connectedCallback() {
        
    }

    fetchPicklistValues() {
        getPicklistValues({ objectName: 'Account', fieldName: 'Industry' })
            .then((result) => {
                this.picklistValues = result.map((value) => {
                    return { label: value, value };
                });
            })
            .catch((error) => {
                this.error = error.body.message;
                console.error('Error fetching picklist values:', this.error);
            });
    }




    @wire(getaccountdetails)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.accounts = undefined;
        }
    }





    handleChange(event) {
        const accountId = event.target.dataset.id;
        const selectedValue = event.detail.value;
        InsertDataAccount({ accountId, selectedValue })
            .then(() => {
                console.log(`Updated Account ${accountId} with value ${selectedValue}`);
            })
            .catch(error => {
                console.error('Error updating record:', error);
            });
    }
}
