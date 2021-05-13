import QuestionPacks from "../imports/api/collections/QuestionPacks";

Object.defineProperty(Promise.prototype, 'then', {
    writable: true
})

import '../imports/api/fixtures'
import '../imports/api/methods'
import '../imports/api/publications'
import AdminClient from "./lib/talky/clients/adminClientClass";
import BotClient from "./lib/talky/clients/botClientClass";
import Configs from "../imports/api/collections/Configs";

const SEED_USERNAME = 'admin';
const SEED_PASSWORD = 'podtalky';

Meteor.startup( () => {
    if (!Accounts.findUserByUsername(SEED_USERNAME)) {
        Accounts.createUser({
            username: SEED_USERNAME,
            password: SEED_PASSWORD,
        });
    }

    const user = Accounts.findUserByUsername(SEED_USERNAME);

    BotClient.updateStatus(false, null)
    AdminClient.updateStatus(false, null);


    BotClient.startChatClient();
   /* QuestionPacks.find().forEach(item => {
        QuestionPacks.update(item._id, {
            $set: {
                active: false
            }
        })
    })*/
});
