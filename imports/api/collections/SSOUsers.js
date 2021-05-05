import { Mongo } from 'meteor/mongo';


class SSOUsers {
    constructor() {
        this.collection = new Mongo.Collection('SSOUsers');
    }
}

const SSOUSERSCLASS = new SSOUsers();

export default SSOUSERSCLASS.collection;
export const SSOUsersClass = SSOUSERSCLASS;
