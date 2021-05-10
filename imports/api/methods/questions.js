import { Meteor } from 'meteor/meteor';
import Questions from '../collections/Questions'
import {check, Match} from 'meteor/check'
import QuestionPacks from "../collections/QuestionPacks";

Meteor.methods({
    'questionRemove'(quId) {
        if(!quId)
            throw new Meteor.Error('ID is required');

        const qu = Questions.findOne(quId);
        if(!qu)
            throw new Meteor.Error('ID is wrong');

        Questions.remove(qu._id, (error, result) => {
            if(error) {
                console.log(error);
                throw new Meteor.Error(error);
            }

            return result;
        });
    },

    'questionCreate'(params) {
        let {
            packId,
            question,
            answers,
            correctAnswers,
            negativeScore,
            positiveScore,
            order,
            showAnswersToUser,
        } = params;

        const IsNumeric = Match.Where(function(num) {
            return !isNaN(parseInt(num)) && isFinite(num);
        });

        check(order, IsNumeric);
        check(positiveScore, IsNumeric);
        check(negativeScore, IsNumeric);

        check(showAnswersToUser, Boolean)

        if(!packId || !packId.length)
            throw new Meteor.Error('Pack Id is required')

        console.log(packId)
        const pack = QuestionPacks.findOne({_id: packId});
        if(!pack)
            throw new Meteor.Error('Pack Not Found')

        return Questions.insert({
            packId: pack._id, question, answers, showAnswersToUser, correctAnswers, negativeScore, positiveScore, order,
            createdAt: new Date()
        });
    },
    'questionUpdate'(params) {
        let {
            _id,
            packId,
            question,
            answers,
            correctAnswers,
            negativeScore,
            positiveScore,
            order,
            showAnswersToUser
        } = params;

        if(!_id || !_id.length)
            throw new Meteor.Error('Question Id is required')

        const IsNumeric = Match.Where(function(num) {
            return !isNaN(parseInt(num)) && isFinite(num);
        });

        check(order, IsNumeric);
        check(positiveScore, IsNumeric);
        check(negativeScore, IsNumeric);

        check(showAnswersToUser, Boolean)

        if(!packId || !packId.length)
            throw new Meteor.Error('Pack Id is required')

        console.log(packId)
        const pack = QuestionPacks.findOne({_id: packId});
        if(!pack)
            throw new Meteor.Error('Pack Not Found')

        /*return Questions.insert({
            packId: pack._id, question, answers, correctAnswers, negativeScore, positiveScore, order,
            createdAt: new Date()
        });*/
        return Questions.update(_id, {
            $set: {
                packId: pack._id,
                question, answers, correctAnswers, showAnswersToUser, negativeScore, positiveScore, order,
            }
        });
    },

});

