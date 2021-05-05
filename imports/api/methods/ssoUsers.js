import { Meteor } from 'meteor/meteor';
import Users from "../collections/SSOUsers";
import Configs from "../collections/Configs";

Meteor.methods({
    'SSOUser.Update'(id, value) {
        const config = Configs.findOne({_id: id});
        if(!config) {
            throw new Meteor.Error('500', 'Not found', 'the config is not found');
        }

        return Users.update(id, {
            $set: {
                value: value,
            }
        });
    },
    'SSOUser.Insert'(id, value) {
        return Users.insert({
            value,
        });
    },
    'SSOUser.List'() {
        return Users.find({}).fetch()
    },


});

