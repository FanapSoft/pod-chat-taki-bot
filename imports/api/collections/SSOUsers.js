import { Mongo } from 'meteor/mongo';
import {check} from 'meteor/check'

/**
 * SSOId, username, name, firstName, lastName joinedFromThread, p2pThread, createdAt
 */
class SSOUsers {
    constructor() {
        this.collection = new Mongo.Collection('SSOUsers');
    }

    saveUser({SSOId, username, name, firstName, lastName, joinedFromThread, p2pThread}){
        this.collection.insert({
            SSOId, username, name, firstName, lastName, joinedFromThread, p2pThread, createdAt: new Date()
        })
    }

    updateUserBySSOId(SSOId, data) {
        this.collection.update({SSOId: SSOId}, {
            $set: data
        });
    }
}

const SSOUSERSCLASS = new SSOUsers();

export default SSOUSERSCLASS.collection;
export const SSOUsersClass = SSOUSERSCLASS;
