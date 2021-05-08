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
        check(duration, Number);
        check(threshold, Number);
        check(status, Number);

        return QuestionPacks.insert({
            title, startsAt, endsAt, duration, threshold, status
        });
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
        check(startsAt, Date);
        check(endsAt, Date);

        const IsNumeric = Match.Where(function(num) {
            return !isNaN(parseInt(num)) && isFinite(num);
        })
        check(duration, IsNumeric);
        check(threshold, IsNumeric);
        check(status, IsNumeric);

        return QuestionPacks.update(_id, {
            title,
            startsAt,
            endsAt,
            duration: parseInt(duration),
            threshold: parseInt(threshold),
            status: parseInt(status)
        });
    },

});

