import { Meteor } from 'meteor/meteor';
import QuestionPacks from '../collections/QuestionPacks'
import {check, Match} from 'meteor/check'
import BotClient from "../../../server/lib/talky/clients/botClientClass";

Meteor.methods({
    'questionPackRemove'(packId) {
        if(!packId)
            throw new Meteor.Error('ID is required');

        const pack = QuestionPacks.findOne(packId);
        if(!pack)
            throw new Meteor.Error('ID is wrong');

        QuestionPacks.remove(pack._id, (error, result) => {
            if(error) {
                console.log(error);
                throw new Meteor.Error(error);
            }

            return result;
        });
    },

    'questionPackCreate'(params) {
        let {
            title,
            startsAt,
            endsAt,
            duration,
            threshold,
            //status
        } = params;

        check(title, String);
        check(startsAt, Date);
        check(endsAt, Date);

        const IsNumeric = Match.Where(function(num) {
            return !isNaN(parseInt(num)) && isFinite(num);
        });

        check(duration, IsNumeric);
        check(threshold, IsNumeric);


        return QuestionPacks.insert({
            title, startsAt, endsAt, duration, threshold, //status,
            totalMessagesSentByBot: 0,
            totalMessagesBotReceived: 0,
            createdAt: new Date()
        },null,  () => {
            if(BotClient.client) {
                BotClient.stopChatClient();
                BotClient.startChatClient();
            }
        });
    },
    'deactivateAllPacksExcept'(pack) {
        const packs = QuestionPacks.find({active: true});
        packs.forEach(item => {
            QuestionPacks.update(item._id, {
                $set: {
                    active: false
                }
            })
        })

        const pc = QuestionPacks.findOne({_id: pack._id})
        return QuestionPacks.update(pack._id, {
            $set: {
                active: true
            }
        })
    },
    'questionPackUpdate'(params) {
        let {
            _id,
            title,
            startsAt,
            endsAt,
            duration,
            threshold
        } = params;

        if(!_id)
            throw new Meteor.Error('Id is required')

        check(title, String);
/*
        check(startsAt, Date);
        check(endsAt, Date);
*/

/*
        const IsNumeric = Match.Where(function(num) {
            return !isNaN(parseInt(num)) && isFinite(num);
        });

        check(duration, IsNumeric);
        check(threshold, IsNumeric);
        check(status, IsNumeric);
*/

        return QuestionPacks.update(_id, {
            $set: {
                title,
                startsAt,
                endsAt,
                duration: parseInt(duration),
                threshold: parseInt(threshold)
            }
        },null, (error, result) => {
            if(error) {
                console.log(error);
                return;
            }
            if(BotClient.client) {
                BotClient.stopChatClient();
                BotClient.startChatClient();
            }
        });
    },

});

