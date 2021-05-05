import ChatClientBaseClass from "../chatClientBaseClass"
import bound from "../../../../imports/lib/bound";

class BotClientClass extends ChatClientBaseClass {
    constructor() {
        let defaultConfig = {
            statusKey: 'botClientStatus',
            tokenKey: 'botToken',
            clientProfileKey: 'botClientProfile'
        }
        super(defaultConfig);

        this.botCommands = ['start']
    }

    startListeningToMessages() {
        if(!this.client)
            return;

        this.client.on('messageEvents', function (event) {
            bound(()=>{
                switch (event.type) {
                    case 'MESSAGE_NEW':

                        break;
                }
            })

        });
    }
}

const BotClient = new BotClientClass()
export default BotClient;
