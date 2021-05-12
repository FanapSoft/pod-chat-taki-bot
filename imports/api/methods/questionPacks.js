import { Meteor } from 'meteor/meteor';
import QuestionPacks from '../collections/QuestionPacks'
import {check, Match} from 'meteor/check'

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
            status
        } = params;

        check(title, String);
        check(startsAt, Date);
        check(endsAt, Date);

        const IsNumeric = Match.Where(function(num) {
            return !isNaN(parseInt(num)) && isFinite(num);
        });

        check(duration, IsNumeric);
        check(threshold, IsNumeric);
        check(status, IsNumeric);

        return QuestionPacks.insert({
            title, startsAt, endsAt, duration, threshold, status,
            createdAt: new Date()
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
            threshold,
            status
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

        QuestionPacks.update(_id, {
            $set: {
                title,
                startsAt,
                endsAt,
                duration: parseInt(duration),
                threshold: parseInt(threshold),
                status: parseInt(status)
            }
        });
    },

});

