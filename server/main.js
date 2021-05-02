import '../imports/api/fixtures'
import '../imports/api/methods'
import '../imports/api/publications'

const SEED_USERNAME = 'admin';
const SEED_PASSWORD = 'podtalky';

Meteor.startup(() => {
    if (!Accounts.findUserByUsername(SEED_USERNAME)) {
        Accounts.createUser({
            username: SEED_USERNAME,
            password: SEED_PASSWORD,
        });
    }

    const user = Accounts.findUserByUsername(SEED_USERNAME);
});
