import { Meteor } from 'meteor/meteor';
import Configs from '../collections/Configs'
import BotClient from "../../../server/lib/talky/clients/botClientClass";
import AdminClient from "../../../server/lib/talky/clients/adminClientClass";

Meteor.methods({
    'configUpdate'(id, value) {
        const config = Configs.findOne({_id: id});
        if(!config) {
            throw new Meteor.Error('500', 'Not found', 'the config is not found');
        }

        return Configs.update(id, {
            $set: {
                value: value,
            }
        }, () => {
            if(['botToken', 'adminToken'].includes(id)){
                if(BotClient.client) {
                    BotClient.stopChatClient();
                    BotClient.startChatClient();
                }
                if(AdminClient.client){
                    AdminClient.stopChatClient();
                    AdminClient.startChatClient();
                }
            }
        })
    },
/*    'configInsert'(id, value) {
        return Configs.insert({
            value,
        });
    },*/
    'configList'() {
        return Configs.find({}).fetch()
    },
    'toggleBotClient'() {
        if(BotClient.client)
            BotClient.stopChatClient();
        else
            BotClient.startChatClient();
    },
    'toggleAdminClient'() {
        if(AdminClient.client)
            AdminClient.stopChatClient();
        else
            AdminClient.startChatClient();
    },
});

