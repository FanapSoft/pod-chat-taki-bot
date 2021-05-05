import ChatClientBaseClass from "../chatClientBaseClass"

class AdminClientClass extends ChatClientBaseClass{
    constructor() {
        let defaultConfig = {
            client: null,
            statusKey: 'adminClientStatus',
            tokenKey: 'adminToken',
            clientProfileKey: 'adminClientProfile'
/*            clientStatus: {
                active: false,
                error: null
            }*/
        }
        super(defaultConfig);
    }

    createBot(username) {
        let params = {
            botName: username
        };

        return this.client.createBot(params, res => {
            return res;
        });
    }

    addBotToThread(thread, botUsername) {
        this.client.addParticipants({
            threadId: thread,
            usernames: [botUsername]
        });
    }

    defineBotCommands(botUsername) {
        if(!this.client)
            return;

        let params = {
            botName: botUsername,
            commandList: ['start']
        };

        this.client.defineBotCommand(params, result => {
            console.log(result)
        })
    }
}

const AdminClient = new AdminClientClass()

export default AdminClient;
