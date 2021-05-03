import Configs from "../../api/collections/Configs";
import chatClient from "./chatClient";
import bound from "../bound";

class chatClientsClass {
    constructor() {
        this.AdminChatClient = undefined;
        this.BotChatClient = undefined;
        this.adminClientStatus = {
            active: false,
            error: null
        }
        this.botClientStatus = {
            active: false,
            error: null
        }
    }

    startAdminChatClient() {
        const adminToken = Configs.collection.findOne('adminToken');
        if(adminToken) {
            const clientForAdmin = new chatClient({token: adminToken.value});
            this.AdminChatClient = clientForAdmin.client;
            Configs.collection.upsert('adminClientStatus', {$set:{value:{active:true, error:null}}});
            this.AdminChatClient.on('error', error => {
                bound(() => {
                    if(error.message) {
                        this.saveTheError('adminClientStatus', {active:true, error: error.message});
                    }
                });
            });
        }
    }
    stopAdminChatClient() {
        if(!this.AdminChatClient)
            return;
        this.AdminChatClient.logout();
        this.AdminChatClient = undefined;
        Configs.collection.update('adminClientStatus', {$set:{value:{active:false, error:null}}});
    }

    startBotChatClient() {
        const botToken = Configs.collection.findOne('botToken');

        if(botToken) {

            const botClient = new chatClient({token: botToken.value});
            this.BotChatClient = botClient.client;
            Configs.collection.upsert('botClientStatus', {$set:{value:{active:true, error:null}}});
            this.BotChatClient.on('error', error => {
                bound(() => {
                    if(error.message) {
                        this.saveTheError('botClientStatus', {active:true, error: error.message});
                    }
                });
            });
        }
    }
    stopBotChatClient() {
        if(!this.BotChatClient)
            return;
        this.BotChatClient.logout();
        this.BotChatClient = undefined;
        Configs.collection.update('botClientStatus', {$set:{value:{active:false, error:null}}});
    }
    saveTheError(selector, value){
        Configs.collection.update(selector, {$set:{value: value}})
    }
    /*publishServerStateToAll() {
        console.log('botclientStatus:: ', this.botClientStatus)
        Meteor.server.stream_server.open_sockets.forEach(connection => {
            connection._meteorSession._namedSubs.forEach(sub => {
                if (sub._name == "botClientStatus") {
                    console.log('botclientStatus2:: ', this.botClientStatus)
                    sub.changed("botClientStatus", "bot_client_status", this.botClientStatus);
                }
            });
        });
    }*/
}

export default new chatClientsClass()
