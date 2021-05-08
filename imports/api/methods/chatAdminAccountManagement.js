import { Meteor } from 'meteor/meteor';
import Configs from '../collections/Configs'
import BotClient from "../../../server/lib/talky/clients/botClientClass";
import AdminClient from "../../../server/lib/talky/clients/adminClientClass";
import bound from "../../lib/bound";
import {check, Match} from 'meteor/check'

Meteor.methods({
    'adminClientProfile'(username) {
        return AdminClient.client.getCurrentUser();
    },
    'adminClientCreateBot'(username) {
        check(username, String)
        const promise = new Promise((resolve, reject) => {
            AdminClient.client.createBot({botName:username.trim()}, result => {
                bound(()=>{
                    if(!result.hasError && result.result.apiToken) {
                        console.log('Bot has been created and ready to use. I stored its api token too! Enjoy !!');
                        Configs.upsert('botUsername', {$set: {value: username}});
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
            let botName = Configs.findOne('botUsername');
            check(commands, Array, Match.Where(value => value.length > 5))
            Configs.upsert('botCommands', {$set: {value: commands}})

            AdminClient.client.defineBotCommand({botName: botName.value, commandList: commands}, result => {
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
    'adminClientAddBotToThread'(threadId) {
        const promise = new Promise((resolve, reject) => {
            let botName = Configs.findOne('botUsername');

            check(threadId, String);
            Configs.upsert('botDefaultThread', {$set: {value: threadId}})
            AdminClient.client.addParticipants({threadId: threadId, usernames: [botName.value]}, result => {
                bound(()=> {
                    if(!result.hasError) {
                        AdminClient.client.startBot({threadId: threadId, botName: botName.value}, res => {
                            bound(()=> {
                                resolve({addToThreadResult:result.result, startInThreadResult: res.result});
                            });
                        });

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

