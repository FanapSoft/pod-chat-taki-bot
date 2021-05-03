import chatClients from "../imports/lib/talky/chatClients";

Object.defineProperty(Promise.prototype, 'then', {
    writable: true
})

import '../imports/api/fixtures'
import '../imports/api/methods'
import '../imports/api/publications'
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

    Configs.collection.upsert('botClientStatus', {
        $set: {value:{active:false, error: null}}
    })
});
