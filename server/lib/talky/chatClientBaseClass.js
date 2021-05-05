import Configs from "../../../imports/api/collections/Configs";
import chatClient from "./chatClient";
import bound from "../../../imports/lib/bound";

class ChatClientBaseClass {
    constructor(props) {
        this.client = null;
        this.statusKey = props.statusKey;
        this.tokenKey = props.tokenKey;
        this.clientProfileKey = props.clientProfileKey;
        this.chatReady = false;
/*        this.clientStatus = {
            active: false,
            error: null
        }*/
    }

    startChatClient() {
        const token = this.getToken();
        if(token) {
            const clt = new chatClient({token: token});
            this.client = clt.client;
            this.client.on('chatReady', () => {
                bound(()=>{
                    this.chatReady = true;
                    this.saveProfile();
                })
            })
            this.startErrorListener();
            this.startListeningToMessages();

            this.updateStatus(true, null);
        }
    }

    stopChatClient() {
        if(!this.client)
            return;
        this.client.logout();
        this.client = null;
        this.updateStatus(false, null)
    }

    updateStatus(active, error) {
        Configs.upsert(this.statusKey, {$set:{value:{active:active, error:error}}});
    }

    getCurrentUser(){

    }

    getToken() {
        const record = Configs.findOne(this.tokenKey);
        return record ? record.value : null
    }

    startErrorListener() {
        this.client.on('error', error => {
            bound(() => {
                if(error.message) {
                    this.updateStatus(true, error.message);
                }
            });
        });
    }
    saveProfile() {
        const botProfile = this.client.getCurrentUser();
        console.log(botProfile);
        Configs.upsert(this.clientProfileKey, {$set: {value: botProfile}});
    }

    /**
     * Implement this to listen to messageEvents
     */
    startListeningToMessages() {}
}

export default ChatClientBaseClass
