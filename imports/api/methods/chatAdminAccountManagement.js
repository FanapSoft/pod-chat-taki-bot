import { Meteor } from 'meteor/meteor';
import Configs from '../collections/Configs'
import BotClient from "../../../server/lib/talky/clients/botClientClass";
import AdminClient from "../../../server/lib/talky/clients/adminClientClass";
import bound from "../../lib/bound";

Meteor.methods({
    'adminClientProfile'(username) {
        return AdminClient.client.getCurrentUser();
    },
    'adminClientCreateBot'(username) {

        const promise = new Promise((resolve, reject) => {
            AdminClient.client.createBot({botName:username}, result => {
                bound(()=>{
                    if(!result.hasError && result.result.apiToken) {
                        console.log('Bot has been created and ready to use. I stored its api token too! Enjoy !!');
                        Configs.update('botToken', {$set: {value: result.result.apiToken}}, (error, result) => {
                            BotClient.startChatClient();
                            //e01e773d405f4d64ae014f53eac20bcf
                            resolve(result.result)
                        });
                    } else {
                        reject(result.errorMessage)
                    }
                })
            });
        }).then(result => {
            return result;
        }).catch(e => {
            throw new Meteor.Error('500', e.message);
        });
        return promise.await()
    },
    'adminClientSetBotCommands'(commands) {
        const promise = new Promise((resolve, reject) => {
            AdminClient.client.defineBotCommand(commands, result => {
                bound(()=> {
                    if(!result.hasError) {
                        resolve(result.result)
                    } else {
                        reject(result.errorMessage)
                    }
                });
            });
        }).then(result => {
            return result;
        }).catch(e => {
            throw new Meteor.Error('500', e.message);
        });
        return promise.await();
    },

});

