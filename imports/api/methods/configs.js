import { Meteor } from 'meteor/meteor';
import Configs from '../collections/Configs'

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
    'configInsert'(id, name, value) {
        return Configs.collection.insert({
            name,
            value,
        });
    },
    'configList'() {
        return Configs.collection.find({}).fetch()
    },

});

