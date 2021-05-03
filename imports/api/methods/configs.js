import { Meteor } from 'meteor/meteor';
import Configs from '../collections/Configs'
import chatClients from "../../lib/talky/chatClients";

Meteor.methods({
    'configUpdate'(id, value) {
        const config = Configs.collection.findOne({_id: id});
        if(!config) {
            throw new Meteor.Error('500', 'Not found', 'the config is not found');
        }

        return Configs.collection.update(id, {
            $set: {
                value: value,
            }
        });
    },
    'configInsert'(id, value) {
        return Configs.collection.insert({
            value,
        });
    },
    'configList'() {
        return Configs.collection.find({}).fetch()
    },
    'toggleBotClient'() {
        if(chatClients.BotChatClient)
            chatClients.stopBotChatClient();
        else
            chatClients.startBotChatClient();
    },
    'toggleAdminClient'() {
        if(chatClients.AdminChatClient)
            chatClients.stopAdminChatClient();
        else
            chatClients.startAdminChatClient();
    },


});

