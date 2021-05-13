import { Meteor } from 'meteor/meteor';
import Configs from "../collections/Configs";
import BotClient from "../../../server/lib/talky/clients/botClientClass";
import AdminClient from "../../../server/lib/talky/clients/adminClientClass";
import Answers from "../collections/Answers";

Meteor.methods({
    'answerRemove'(id) {
        const answer = Answers.findOne({_id: id});
        if(!answer) {
            throw new Meteor.Error('500', 'Not found', 'the answer is not found');
        }

        return Answers.remove(id)
    },
});

