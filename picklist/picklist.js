
import { LightningElement, wire, track } from 'lwc';
import getAccountList from '@salesforce/apex/combofromaccount.getAccountList';
import getPicklistValues from '@salesforce/apex/combofromaccount.getPicklistValues';
import insertdata from '@salesforce/apex/combofromaccount.insertdata';

export default class Picklist extends LightningElement {
    @track accounts;
    @track picklistOptions = [];
    @track error;

    @wire(getAccountList)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.accounts = undefined;
        }
    }

    @wire(getPicklistValues, { objectName: 'Account', fieldName: 'Active__c' })
    wiredPicklist({ error, data }) {
        if (data) {
            this.picklistOptions = data.map(value => ({ label: value, value: value }));
        } else if (error) {
            console.error('Error fetching picklist values:', error);
        }
    }

    handleChange(event) {
        const accountId = event.target.dataset.id;
        const selectedValue = event.detail.value;
        insertdata({ accountId, selectedValue })
            .then(() => {
                console.log(`Updated Account ${accountId} with value ${selectedValue}`);
            })
            .catch(error => {
                console.error('Error updating record:', error);
            });
    }
}
