import { Mongo } from 'meteor/mongo';


class Configs {
    constructor() {
        this.collection = new Mongo.Collection('Configs');
    }
}

//export default new Configs();
const CONFIGSCLASS = new Configs();

export default CONFIGSCLASS.collection;
export const ConfigsClass = CONFIGSCLASS;
/*
Lists.schema = new SimpleSchema({
    name: {type: String},
    incompleteCount: {type: Number, defaultValue: 0},
    userId: {type: String, regEx: SimpleSchema.RegEx.Id, optional: true}
});
*/
