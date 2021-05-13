import { Mongo } from 'meteor/mongo';
import {check} from 'meteor/check'
/**
 * Fields: time, message
 */
class BotLogs {
    constructor() {
        this.collection = new Mongo.Collection('BotLogs');
    }

    Log(message) {
        check(message, String)
        this.collection.insert({
            message: message,
            time: new Date()
        })
    }
}

//export default new Configs();
const BOTLOGSCLASS = new BotLogs();

export default BOTLOGSCLASS.collection;
export const BotLogsClass = BOTLOGSCLASS;
